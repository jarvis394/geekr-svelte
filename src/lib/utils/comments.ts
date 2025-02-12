import type { Comment } from '$lib/types/Comment'

export const commentsContextKey = 'article-comments'

interface CollapseBranchProps {
	nodes: Comment[]
	collapsedRoots: Record<string, boolean>
	parentId: Comment['id']
}

export const getCollapsedNodes = ({ nodes, collapsedRoots, parentId }: CollapseBranchProps) => {
	const collapsedComments: Comment[] = []
	const parentIndex = nodes.findIndex((e) => e.id === parentId)
	const parentComment = nodes[parentIndex]
	let isInCollapsed = false
	let subCollapsedRoot: Comment | null = null

	for (let i = parentIndex + 1; i < nodes.length - 1; i++) {
		const current = nodes[i]
		const next = nodes[i + 1]
		if (isInCollapsed && subCollapsedRoot && next.level <= subCollapsedRoot?.level) {
			isInCollapsed = false
		} else if (!isInCollapsed) {
			collapsedComments.push(current)

			// Thread has collapsed sub-thread
			if (collapsedRoots[current.id]) {
				isInCollapsed = true
				subCollapsedRoot = current
			}
		}

		if (next.level <= parentComment.level) break
	}

	return {
		collapsedComments,
		parentCommentId: parentComment.id
	}
}
