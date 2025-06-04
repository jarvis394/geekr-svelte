import { browser } from '$app/environment'
import { cache } from '$lib/utils/cacheFetch'
import * as api from '$lib/api'
import { type Article } from '$lib/types'
import { getArticleLink, getArticleQueryKey } from '$lib/utils'
import { replaceState } from '$app/navigation'

type ArticleLoaderProps = { id: string; fetch: typeof fetch; isCorporative?: boolean }
export const articleLoader = async ({ id, fetch, isCorporative }: ArticleLoaderProps) => {
	const fetchArticle = async (id: string) => {
		const data = await api.article.get({
			id,
			fetch
		})

		if (browser) {
			// Should not set any data to cache on server as it will persist indefinetly
			cache.set(getArticleQueryKey(id), data)

			// Redirect from /articles/... if the article is corporative
			if (data.isCorporative && !isCorporative) {
				const url = getArticleLink(data)
				replaceState(url || '', {})
			}
		}

		return data
	}

	const article = await fetchArticle(id)
	const cachedArticle = browser
		? (cache.get(getArticleQueryKey(id)) as Article | undefined)
		: article

	return {
		id,
		isCorporative,
		article,
		cachedArticle
	}
}
