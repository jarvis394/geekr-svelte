<script lang="ts">
	import type { APIResponseComments, Comment, CommentBranch } from '$lib/types'
	import { WindowVirtualizer } from 'virtua/svelte'
	import { ArticleComment } from '$lib/components/article-comment'
	import { flattenComments } from '$lib/utils/comments'
	import { SvelteMap } from 'svelte/reactivity'
	import { tick } from 'svelte'

	type ArticleCommentsPageProps = { comments: APIResponseComments }
	const { comments: propsComments }: ArticleCommentsPageProps = $props()

	/** Real comments data */
	let comments = $state<Comment[]>(flattenComments(propsComments))
	/** Items that are rendered in virtualized list */
	let items = $state<Comment[]>(comments)
	const collapsedRoots = new SvelteMap<string, { collapsedAmount: number }>()

	let highlightedCommentIndex = $state(-1)
	let branchHighlightStyles = $state('')
	let virtualizer: WindowVirtualizer<Comment> | undefined = $state()

	const highlightBranch = (branch: CommentBranch) => {
		branchHighlightStyles = `<style>
			.ArticleComment__branch[data-comment-branch-for="${branch.parentId}"] {
				border-left-width: 2px;
				border-color: hsl(var(--foreground) / 1);
			}
		</style>`
	}

	const resetBranchHighlight = () => {
		branchHighlightStyles = ''
	}

	const scrollToComment = async (id: string, index: number) => {
		highlightedCommentIndex = -1
		await tick()
		// virtualizer?.scrollToIndex(index, {
		// 	smooth: true,
		// 	offset: -48
		// })
		const commentElement = document.querySelector(`section[data-comment-id="${id}"]`)
		// TODO: fixme offset
		commentElement?.scrollIntoView({
			behavior: 'instant'
		})
		window.scrollBy({
			behavior: 'smooth',
			top: -48
		})
		highlightedCommentIndex = index
	}

	const syncVirtualItems = () => {
		items = comments.filter((e) => !e.isCollapsed)
	}

	const onBranchClick = (branch: CommentBranch) => {
		let startIndex = -1
		let collapsedAmount = 0

		for (let i = 0; i < comments.length; i++) {
			const current = comments[i]

			if (startIndex === -1) {
				if (current.id === branch.parentId) {
					startIndex = i
				}
				continue
			}

			const startComment = comments[startIndex]

			if (current.level > startComment.level) {
				comments[i].isCollapsed = true
				collapsedAmount++
			} else {
				break
			}
		}

		syncVirtualItems()
		collapsedRoots.set(branch.parentId, {
			collapsedAmount
		})

		const index = items.findIndex((e) => e.id === comments[startIndex].id)
		resetBranchHighlight()
		scrollToComment(branch.parentId, index)
	}

	const expandBranch = (comment: Comment) => {
		let startIndex = -1
		let otherCollapsedLevel = Infinity

		for (let i = 0; i < comments.length; i++) {
			const current = comments[i]

			if (startIndex === -1) {
				if (current.id === comment.id) {
					startIndex = i
				}
				continue
			}

			if (otherCollapsedLevel <= current.level) {
				continue
			} else {
				otherCollapsedLevel = Infinity
			}

			if (collapsedRoots.has(current.id)) {
				otherCollapsedLevel = current.level + 1
			}

			const startComment = comments[startIndex]

			if (current.level > startComment.level) {
				comments[i].isCollapsed = false
			} else {
				break
			}
		}

		collapsedRoots.delete(comment.id)
		syncVirtualItems()
		highlightedCommentIndex = -1
	}

	const getItemKey = (item: Comment) => item.id
</script>

{@html branchHighlightStyles}
<div class="ArticleComments flex translate-z-0 flex-col contain-content [&>div]:contain-content">
	<!-- {#if mounted}
		<WindowVirtualizer bind:this={virtualizer} getKey={getItemKey} data={items}>
			{#snippet children(item: Comment, index)}
				{#await import('$lib/components/article-comment')}
					<div class="h-100"></div>
				{:then { ArticleComment }}
					<ArticleComment
						{expandBranch}
						{onBranchClick}
						{highlightBranch}
						{resetBranchHighlight}
						comment={item}
						highlighted={highlightedCommentIndex === index}
						collapsedRoot={collapsedRoots.get(item.id)}
					/>
				{/await}
			{/snippet}
		</WindowVirtualizer>
	{:else} -->
	{#each comments as item, index ('comment:' + item.id)}
		<ArticleComment
			{expandBranch}
			{onBranchClick}
			{highlightBranch}
			{resetBranchHighlight}
			comment={item}
			highlighted={highlightedCommentIndex === index}
			collapsedRoot={collapsedRoots.get(item.id)}
		/>
	{/each}
	<!-- {/if} -->
</div>
