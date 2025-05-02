import type { APIResponseComments, Article } from '$lib/types'
import type { Comment } from '$lib/types/Comment'
import * as api from '$lib/api'
import { browser } from '$app/environment'
import { cache } from './cacheFetch'

export const getArticleCommentsQueryKey = (id: Article['id']) => {
	return ['article', id, 'comments'].join(':')
}

export const flattenComments = (response: APIResponseComments) => {
	const { comments, threads } = response
	const result: Comment[] = []

	threads.forEach((thread) => {
		const stack = [thread]

		while (stack.length > 0) {
			const commentId = stack.pop()
			const comment = comments[commentId!]

			if (comment) {
				if (comment.level > 6) comment.level = 6
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

type ArticleCommentsLoaderProps = { id: string; fetch: typeof fetch }
export const articleCommentsLoader = ({ id, fetch }: ArticleCommentsLoaderProps) => {
	const fetchArticleComments = async (id: string) => {
		const data = await api.article.getComments({
			id,
			fetch
		})

		// Should not set any data to cache on server as it will persist indefinetly
		if (browser) cache.set(getArticleCommentsQueryKey(id), data)

		return data
	}

	const comments = fetchArticleComments(id)
	const cachedComments = browser
		? (cache.get(getArticleCommentsQueryKey(id)) as APIResponseComments | undefined)
		: undefined

	return {
		comments,
		cachedComments
	}
}
