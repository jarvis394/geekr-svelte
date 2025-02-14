<script lang="ts">
	import type { APIResponseComments, Comment, CommentBranch } from '$lib/types'
	import { Header } from '../header'
	import { WindowVirtualizer } from 'virtua/svelte'
	import { ArticleComment } from '../article-comment'
	import { createBranches } from '$lib/utils/comments'

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

	let comments = $state<Array<Comment | string>>(flattenComments(propsComments))
	let branchHighlightStyles = $state('')

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

	const onBranchClick = (branch: CommentBranch) => {
		const startIndex = comments.findIndex((e) => typeof e !== 'string' && e.id === branch.parentId)
		let deleteCount = 0
		for (let i = startIndex + 1; i < comments.length; i++) {
			const current = comments[i]
			const startComment = comments[startIndex]

			if (typeof current === 'string' || typeof startComment === 'string') continue
			if (current.level > startComment.level) {
				deleteCount++
			} else {
				break
			}
		}

		comments.splice(startIndex + 1, deleteCount)
	}
</script>

<div class="ArticleComments">
	{@html branchHighlightStyles}
	<Header>Комментарии</Header>
	<WindowVirtualizer getKey={(item: Comment) => item.id} data={comments}>
		{#snippet children(item: Comment)}
			<ArticleComment {onBranchClick} {highlightBranch} {resetBranchHighlight} comment={item} />
		{/snippet}
	</WindowVirtualizer>
</div>
