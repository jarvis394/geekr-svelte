import type { Comment } from '$lib/types/Comment'

export const commentsContextKey = 'article-comments'

// interface CollapseBranchProps {
// 	nodes: Comment[]
// 	collapsedRoots: Record<string, boolean>
// 	parentId: Comment['id']
// }

export interface GetArticleCommentsOptions {
	sortByKarma: boolean
}

// export const parseComments = (
// 	nodes: Record<string, Comment>,
// 	options?: Partial<GetArticleCommentsOptions>
// ) => {
// 	const root: Comment[] = []
// 	for (const id in nodes) {
// 		const comment = nodes[id]
// 		const parent = comment.parentId ? nodes[comment.parentId] : null
// 		const commentChildren = comment.children as unknown as string[]
// 		comment.children = []
// 		comment.childrenIds = commentChildren
// 		if (parent) {
// 			parent.children.push(comment)
// 		} else {
// 			root.push(comment)
// 		}
// 	}
// 	if (options?.sortByKarma) root.sort((a, b) => b.score - a.score)
// 	return flatten(root)
// }
// export const flatten = (nodes: Comment[]) => {
// 	const res: Comment[] = []
// 	const stack: Comment[] = []

// 	nodes.forEach((node) => {
// 		stack.push(node)

// 		while (stack.length) {
// 			const item = stack.shift()

// 			if (!item) break
// 			if (item.children.length > 0) {
// 				item.children.forEach((child) => stack.push(child))
// 			} else {
// 				res.push(item)
// 			}
// 		}
// 	})

// 	return res
// }

export const createBranches = (nodes: Comment[]) => {
	const branches: Comment['branches'] = []
	for (let i = 0; i < nodes.length; i++) {
		const currentNode = nodes[i]
		const nextNode = nodes[i + 1]
		const currentBranchIndex = currentNode.level - 1
		const currentBranch = branches[currentBranchIndex]
		const childrenIdsLength = currentBranch?.childrenIds?.length
		nodes[i].branches = [...branches]
		if (!nextNode) {
			continue
		}
		if (
			currentBranch &&
			(childrenIdsLength == 0 ||
				currentBranch.childrenIds[childrenIdsLength - 1] === currentNode.id)
		) {
			branches[currentBranchIndex] = {
				...currentBranch,
				noBorder: true,
				hidden: true
			}
			nodes[i].branches![currentBranchIndex] = {
				...nodes[i].branches![currentBranchIndex],
				noBorder: true,
				hidden: false
			}
		}
		if (currentNode.level < nextNode.level) {
			branches.push({
				parentId: currentNode.id,
				hidden: currentNode.children.length < 2,
				noBorder: false,
				childrenIds: currentNode.childrenIds || []
			})
		} else if (currentNode.level > nextNode.level) {
			branches.splice(nextNode.level, currentNode.level)
			nodes[i].branches![currentBranchIndex] = {
				...nodes[i].branches![currentBranchIndex],
				noBorder: true,
				hidden: false
			}
		}
	}
	return nodes
}
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
		if (isInCollapsed && next.level <= (subCollapsedRoot?.level || 0)) {
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
