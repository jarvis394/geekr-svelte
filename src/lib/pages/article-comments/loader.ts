import { browser } from '$app/environment'
import { cache } from '$lib/utils/cacheFetch'
import * as api from '$lib/api'
import type { APIResponseComments } from '$lib/types'
import { getArticleCommentsQueryKey } from '$lib/utils/comments'
import { error, isHttpError } from '@sveltejs/kit'
import { lazy } from '$lib/utils/lazy'

type ArticleCommentsLoaderProps = {
	id: string
	fetch: typeof fetch
	isCorporative?: boolean
	post?: boolean
}
export const articleCommentsLoader = async ({ id, fetch, post }: ArticleCommentsLoaderProps) => {
	const fetchArticleComments = async (id: string) => {
		try {
			const { data } = await api[post ? 'posts' : 'article'].getComments({
				id,
				fetch
			})

			if (!data) {
				throw error(404, 'Not found')
			}

			// Should not set any data to cache on server as it will persist indefinetly
			if (browser) cache.set(getArticleCommentsQueryKey(id), data)

			return data
		} catch (e) {
			if (isHttpError(e)) throw error(e.status, e.body)
			else throw error(500, (e as Error).message)
		}
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
