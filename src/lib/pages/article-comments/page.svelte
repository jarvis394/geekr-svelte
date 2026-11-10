<script lang="ts">
	import type { APIResponseComments, Comment, CommentBranch } from '$lib/types'
	import { createWindowVirtualizer } from '@tanstack/svelte-virtual'
	import { ArticleComment } from '$lib/components/article-comment'
	import { flattenComments } from '$lib/utils/comments'
	import { onMount, tick, untrack } from 'svelte'
	import {
		APPBAR_HEIGHT,
		registerScrollRestorer,
		type CommentsScrollAnchor
	} from './scroll-snapshot'

	const BRANCH_HIGHLIGHT_CLASS = 'ArticleComment__branch--highlighted'
	/** Comments rendered on the server, before the virtualizer takes over */
	const SSR_RENDER_COUNT = 20
	/** How long the restored scroll anchor is kept in place while the layout settles */
	const RESTORE_PIN_DURATION_MS = 1500

	type ArticleCommentsPageProps = { comments: APIResponseComments }
	const { comments: propsComments }: ArticleCommentsPageProps = $props()

	/**
	 * Per-comment UI state. Each comment gets its own signals, so collapsing a
	 * branch only re-renders the comments that actually change.
	 */
	class CommentState {
		/** Hidden under a collapsed branch */
		collapsed = $state(false)
		/** Number of hidden descendants when this comment is a collapsed root */
		collapsedAmount = $state<number | undefined>()
		highlighted = $state(false)
	}

	/** Real comments data */
	let comments = $derived<Comment[]>(flattenComments(propsComments))
	let commentStates = $derived(new Map(comments.map((c) => [c.id, new CommentState()])))
	/** Comments that are not hidden under a collapsed branch, rendered by the virtualizer */
	let items = $derived<Comment[]>(comments.filter((c) => !commentStates.get(c.id)?.collapsed))
	let highlightedState: CommentState | undefined
	let highlightedBranchId: string | undefined

	let mounted = $state(false)
	let listElement: HTMLDivElement | undefined = $state()
	/** Distance from the top of the document to the list */
	let scrollMargin = $state(0)
	let listWidth = 400

	const getState = (id: string) => commentStates.get(id)!

	const TAG_REGEXP = /<[^>]+>/g
	const BLOCK_REGEXP = /<(p|br|li|blockquote|pre)\b/g
	const IMAGE_REGEXP = /<img\b/g

	/** Text stats per comment, so estimating sizes doesn't re-run the regexps */
	const messageStats = new Map<string, { textLength: number; blocks: number; images: number }>()
	const getMessageStats = (comment: Comment) => {
		let stats = messageStats.get(comment.id)
		if (!stats) {
			const message = comment.message || ''
			stats = {
				textLength: message.replace(TAG_REGEXP, '').length,
				blocks: message.match(BLOCK_REGEXP)?.length ?? 0,
				images: message.match(IMAGE_REGEXP)?.length ?? 0
			}
			messageStats.set(comment.id, stats)
		}
		return stats
	}

	/** Rough comment height before it is measured, so the scrollbar doesn't jump much */
	const estimateSize = (index: number) => {
		const comment = items[index]
		if (!comment) return 200
		const { textLength, blocks, images } = getMessageStats(comment)
		// Horizontal padding + one 20px branch line per level
		const textWidth = Math.max(listWidth - 32 - comment.level * 20, 160)
		const charsPerLine = textWidth / 8.5
		const lines = Math.max(Math.ceil(textLength / charsPerLine), 1) + Math.max(blocks - 1, 0) * 0.6
		// Header + footer + paddings ~ 110px, line height 25.6px
		return Math.round(110 + lines * 25.6 + images * 220)
	}

	const virtualizer = createWindowVirtualizer<HTMLDivElement>({
		count: 0,
		estimateSize,
		getItemKey: (index) => items[index]?.id ?? index,
		overscan: 6,
		scrollPaddingStart: APPBAR_HEIGHT
	})

	$effect(() => {
		const count = items.length
		const margin = scrollMargin
		untrack(() => $virtualizer.setOptions({ count, scrollMargin: margin }))
	})

	// Keep the list offset (header above the list) and width up to date
	$effect(() => {
		const list = listElement
		if (!list) return
		const update = () => {
			listWidth = list.clientWidth
			scrollMargin = Math.round(list.getBoundingClientRect().top + window.scrollY)
		}
		update()
		window.addEventListener('resize', update, { passive: true })
		return () => window.removeEventListener('resize', update)
	})

	const measureElement = (element: HTMLDivElement) => {
		untrack(() => $virtualizer).measureElement(element)
	}

	/**
	 * Toggle the highlight class on the branch buttons directly. Injecting a
	 * `<style>` tag forces a style recalculation of the whole document.
	 */
	const setBranchHighlight = (parentId: string | undefined) => {
		if (highlightedBranchId === parentId) return
		const toggle = (id: string | undefined, on: boolean) => {
			if (!id) return
			const selector = `.ArticleComment__branch[data-comment-branch-for="${CSS.escape(id)}"]`
			document.querySelectorAll(selector).forEach((el) => {
				el.classList.toggle(BRANCH_HIGHLIGHT_CLASS, on)
			})
		}
		toggle(highlightedBranchId, false)
		toggle(parentId, true)
		highlightedBranchId = parentId
	}

	const highlightBranch = (branch: CommentBranch) => setBranchHighlight(branch.parentId)
	const resetBranchHighlight = () => setBranchHighlight(undefined)

	const setHighlighted = (state: CommentState | undefined) => {
		if (highlightedState) highlightedState.highlighted = false
		highlightedState = state
		if (state) state.highlighted = true
	}

	const getCommentElement = (id: string) =>
		document.querySelector<HTMLElement>(`section[data-comment-id="${CSS.escape(id)}"]`)

	const scrollToComment = async (id: string) => {
		// Remove the class first so the animation restarts on repeated collapses
		setHighlighted(undefined)
		// Let the virtualizer pick up the new item count
		await tick()
		const index = items.findIndex((c) => c.id === id)
		if (index === -1) return

		// Force a style recalc so re-adding the class restarts the animation
		getCommentElement(id)?.getBoundingClientRect()
		$virtualizer.scrollToIndex(index, { align: 'start', behavior: 'smooth' })
		setHighlighted(getState(id))
	}

	/**
	 * Scroll so the anchor comment is where it was before. The virtualizer
	 * renders it once the estimated offset is reached; then keep it pinned while
	 * comments around it get measured and images load, until the user interacts.
	 */
	const restoreScroll = async (anchor: CommentsScrollAnchor) => {
		// Wait for the list to render and the virtualizer to get its options
		await tick()
		const index = items.findIndex((c) => c.id === anchor.id)
		if (index === -1) return

		// Offset that puts the comment right under the app bar (`scrollPaddingStart`)
		const [offset] = $virtualizer.getOffsetForIndex(index, 'start') ?? []
		if (offset === undefined) return
		window.scrollTo({ top: offset - anchor.offset, behavior: 'instant' })

		const pin = () => {
			const element = getCommentElement(anchor.id)
			if (!element) return
			const diff = element.getBoundingClientRect().top - APPBAR_HEIGHT - anchor.offset
			if (Math.abs(diff) >= 1) window.scrollBy({ top: diff, behavior: 'instant' })
		}
		keepPinned(pin)
	}

	const keepPinned = (pin: () => void) => {
		const userEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const
		const startedAt = performance.now()
		let frame = 0
		const loop = () => {
			pin()
			if (performance.now() - startedAt < RESTORE_PIN_DURATION_MS) {
				frame = requestAnimationFrame(loop)
			} else stop()
		}
		const stop = () => {
			cancelAnimationFrame(frame)
			userEvents.forEach((e) => window.removeEventListener(e, stop))
		}
		userEvents.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }))
		frame = requestAnimationFrame(loop)
	}

	onMount(() => {
		mounted = true
		return registerScrollRestorer(restoreScroll)
	})

	const findIndex = (id: string) => comments.findIndex((c) => c.id === id)

	const onBranchClick = (branch: CommentBranch) => {
		const startIndex = findIndex(branch.parentId)
		if (startIndex === -1) return

		const startLevel = comments[startIndex].level
		let collapsedAmount = 0

		// Descendants are contiguous in DFS order
		for (let i = startIndex + 1; i < comments.length; i++) {
			const current = comments[i]
			if (current.level <= startLevel) break
			getState(current.id).collapsed = true
			collapsedAmount++
		}

		getState(branch.parentId).collapsedAmount = collapsedAmount

		resetBranchHighlight()
		scrollToComment(branch.parentId)
	}

	const expandBranch = (comment: Comment) => {
		const startIndex = findIndex(comment.id)
		if (startIndex === -1) return

		const startLevel = comments[startIndex].level
		let otherCollapsedLevel = Infinity

		for (let i = startIndex + 1; i < comments.length; i++) {
			const current = comments[i]
			if (current.level <= startLevel) break

			// Keep descendants of nested collapsed roots hidden
			if (otherCollapsedLevel <= current.level) continue
			otherCollapsedLevel = Infinity

			const state = getState(current.id)
			if (state.collapsedAmount !== undefined) {
				otherCollapsedLevel = current.level + 1
			}
			state.collapsed = false
		}

		getState(comment.id).collapsedAmount = undefined
		setHighlighted(undefined)
	}
</script>

{#snippet commentRow(item: Comment)}
	{@const state = getState(item.id)}
	<ArticleComment
		{expandBranch}
		{onBranchClick}
		{highlightBranch}
		{resetBranchHighlight}
		comment={item}
		highlighted={state.highlighted}
		collapsedAmount={state.collapsedAmount}
	/>
{/snippet}

{#if mounted}
	{@const virtualItems = $virtualizer.getVirtualItems()}
	<div
		bind:this={listElement}
		class="ArticleComments relative w-full"
		style:height="{$virtualizer.getTotalSize()}px"
	>
		<div
			class="absolute top-0 left-0 flex w-full flex-col"
			style:transform="translateY({(virtualItems[0]?.start ?? scrollMargin) - scrollMargin}px)"
		>
			{#each virtualItems as row (row.key)}
				{@const item = items[row.index]}
				{#if item}
					<div class="flex flex-col" data-index={row.index} {@attach measureElement}>
						{@render commentRow(item)}
					</div>
				{/if}
			{/each}
		</div>
	</div>
{:else}
	<!-- Server render and first client frame: the first comments in normal flow -->
	<div class="ArticleComments flex w-full flex-col">
		{#each comments.slice(0, SSR_RENDER_COUNT) as item ('comment:' + item.id)}
			{@render commentRow(item)}
		{/each}
	</div>
{/if}
