<script lang="ts">
	import type { APIResponseComments, Comment, CommentBranch } from '$lib/types'
	import { Header } from '../header'
	import { WindowVirtualizer } from 'virtua/svelte'
	import { ArticleComment } from '../article-comment'
	import { createBranches } from '$lib/utils/comments'
	import { SvelteMap } from 'svelte/reactivity'
	import { tick } from 'svelte'

	type ArticleCommentsPageProps = { comments: APIResponseComments }
	const { comments: propsComments }: ArticleCommentsPageProps = $props()

	const flattenComments = (response: APIResponseComments) => {
		const { comments, threads } = response
		const result: Comment[] = []

		threads.forEach((thread) => {
			const stack = [thread]

			while (stack.length > 0) {
				const commentId = stack.pop()
				const comment = comments[commentId!]

				if (comment) {
					result.push(comment)

					// DFS order
					for (let i = comment.children.length - 1; i >= 0; i--) {
						stack.push(comment.children[i])
					}
				}
			}
		})

		return createBranches(result)
	}

	let comments = $state<Comment[]>(flattenComments(propsComments))
	const collapsedRoots = new SvelteMap<string, { collapsedAmount: number }>()
	let highlightedCommentIndex = $state(-1)
	let branchHighlightStyles = $state('')
	let virtualizer: WindowVirtualizer<Comment>

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

	const scrollToIndex = async (index: number) => {
		highlightedCommentIndex = -1
		await tick()
		virtualizer.scrollToIndex(index, {
			smooth: true,
			offset: -48
		})
		highlightedCommentIndex = index
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

		collapsedRoots.set(branch.parentId, {
			collapsedAmount
		})

		resetBranchHighlight()
		scrollToIndex(startIndex)
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
	}
</script>

<div class="ArticleComments">
	{@html branchHighlightStyles}
	<Header>Комментарии</Header>
	<div class="animate-in fade-in">
		<WindowVirtualizer bind:this={virtualizer} getKey={(item: Comment) => item.id} data={comments}>
			{#snippet children(item: Comment, index)}
				{#if !item.isCollapsed}
					<ArticleComment
						{expandBranch}
						{onBranchClick}
						{highlightBranch}
						{resetBranchHighlight}
						comment={item}
						highlighted={highlightedCommentIndex === index}
						collapsedRoot={collapsedRoots.get(item.id)}
					/>
				{/if}
			{/snippet}
		</WindowVirtualizer>
	</div>
</div>
