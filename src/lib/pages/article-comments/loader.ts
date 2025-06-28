import { browser } from '$app/environment'
import { cache } from '$lib/utils/cacheFetch'
import * as api from '$lib/api'
import type { APIResponseComments } from '$lib/types'
import { getArticleCommentsQueryKey } from '$lib/utils/comments'
import { lazy } from '$lib/utils/lazy'

type ArticleCommentsLoaderProps = { id: string; fetch: typeof fetch; isCorporative?: boolean }
export const articleCommentsLoader = async ({ id, fetch }: ArticleCommentsLoaderProps) => {
	const fetchArticleComments = async (id: string) => {
		const { data } = await api.article.getComments({
			id,
			fetch
		})

		// Should not set any data to cache on server as it will persist indefinetly
		if (browser) cache.set(getArticleCommentsQueryKey(id), data)

		return data
	}

	const comments = await lazy(fetchArticleComments(id))
	const cachedComments = browser
		? (cache.get(getArticleCommentsQueryKey(id)) as APIResponseComments | undefined)
		: undefined

	return {
		id,
		comments,
		cachedComments
	}
}
