<script lang="ts">
	import type { APIResponseComments, Comment, CommentBranch } from '$lib/types'
	import { WindowVirtualizer } from 'virtua/svelte'
	import { ArticleComment } from '$lib/components/article-comment'
	import { flattenComments } from '$lib/utils/comments'
	import { tick } from 'svelte'

	/** Height of the fixed app bar (`h-12`) that covers the top of the page */
	const APPBAR_HEIGHT = 48
	const BRANCH_HIGHLIGHT_CLASS = 'ArticleComment__branch--highlighted'

	type ArticleCommentsPageProps = { comments: APIResponseComments }
	const { comments: propsComments }: ArticleCommentsPageProps = $props()

	/**
	 * Per-comment UI state. Each comment gets its own signals, so collapsing a
	 * branch only re-renders the comments that actually change, instead of
	 * invalidating every comment on the page (which `SvelteSet.has`/`SvelteMap.get`
	 * do for missing keys).
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
	/** Items that are rendered in virtualized list (lazy, only computed when read) */
	let items = $derived<Comment[]>(comments.filter((c) => !commentStates.get(c.id)?.collapsed))
	let highlightedState: CommentState | undefined
	let highlightedBranchId: string | undefined
	let virtualizer: WindowVirtualizer<Comment> | undefined = $state()

	const getState = (id: string) => commentStates.get(id)!

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

	const scrollToComment = async (id: string) => {
		const state = getState(id)
		// Remove the class first so the animation restarts on repeated collapses
		setHighlighted(undefined)
		await tick()
		const commentElement = document.querySelector(`section[data-comment-id="${CSS.escape(id)}"]`)
		if (!commentElement) return

		const top = commentElement.getBoundingClientRect().top + window.scrollY - APPBAR_HEIGHT
		window.scrollTo({ top, behavior: 'smooth' })
		setHighlighted(state)
	}

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

	const getItemKey = (item: Comment) => item.id
</script>

<div class="ArticleComments flex translate-z-0 flex-col contain-content [&>div]:contain-content">
	<!-- {#if mounted}
		<WindowVirtualizer bind:this={virtualizer} getKey={getItemKey} data={items}>
			{#snippet children(item: Comment)}
				{@const state = getState(item.id)}
				{#await import('$lib/components/article-comment')}
					<div class="h-100"></div>
				{:then { ArticleComment }}
					<ArticleComment
						{expandBranch}
						{onBranchClick}
						{highlightBranch}
						{resetBranchHighlight}
						comment={item}
						highlighted={state.highlighted}
						collapsedAmount={state.collapsedAmount}
					/>
				{/await}
			{/snippet}
		</WindowVirtualizer>
	{:else} -->
	{#each comments as item ('comment:' + item.id)}
		{@const state = getState(item.id)}
		<ArticleComment
			{expandBranch}
			{onBranchClick}
			{highlightBranch}
			{resetBranchHighlight}
			comment={item}
			collapsed={state.collapsed}
			highlighted={state.highlighted}
			collapsedAmount={state.collapsedAmount}
		/>
	{/each}
	<!-- {/if} -->
</div>
