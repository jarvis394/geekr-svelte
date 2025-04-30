import { browser } from '$app/environment'
import { cache } from '$lib/utils/cacheFetch'
import * as api from '$lib/api'
import { type Article } from '$lib/types'

export const getArticleQueryKey = (id: Article['id']) => {
	return ['article', id].join(':')
}

type ArticleLoaderProps = { id: string; fetch: typeof fetch }
export const articleLoader = ({ id, fetch }: ArticleLoaderProps) => {
	const fetchArticle = async (id: string) => {
		const data = await api.article.get({
			id,
			fetch
		})

		// Should not set any data to cache on server as it will persist indefinetly
		if (browser) cache.set(getArticleQueryKey(id), data)

		return data
	}

	const article = fetchArticle(id)

	return {
		article,
		cachedArticle: browser ? (cache.get(getArticleQueryKey(id)) as Article | undefined) : undefined
	}
}
