import { error, redirect } from '@sveltejs/kit'
import * as api from '$lib/api'
import {
	parseArticlesParams,
	makeArticlesPageUrlFromParams,
	getArticlesQueryKey
} from '$lib/utils/articles'
import { getArticleQueryKey } from '$lib/utils/article'
import { cache, cacheFetch } from '$lib/utils/cacheFetch'
import { browser } from '$app/environment'
import type { Article } from '$lib/types'

type ArticlesLoaderProps = {
	params: { params: string }
	url: URL
	fetch: typeof fetch
	articlesMode?: 'articles' | 'news' | 'posts'
}

export const articlesLoader = async ({
	params,
	url,
	fetch,
	articlesMode = 'articles'
}: ArticlesLoaderProps) => {
	const articlesParamsResult = parseArticlesParams(params.params.split('/'))
	const urlFromParams =
		articlesParamsResult.data &&
		makeArticlesPageUrlFromParams(articlesParamsResult.data, articlesMode)

	if (!articlesParamsResult.success) {
		throw error(404, 'Not Found')
	}

	if (urlFromParams && urlFromParams !== url.pathname) {
		return redirect(302, urlFromParams)
	}

	const { complexity, mode, page, period, flow, rating } = articlesParamsResult.data
	const articles = await cacheFetch(
		getArticlesQueryKey(articlesParamsResult.data, articlesMode),
		async () => {
			const apiMethod = articlesMode === 'posts' ? 'posts' : 'articles'
			const data = await api[apiMethod].get({
				mode: mode === 'new' ? rating : period,
				page,
				complexity,
				flow,
				fetch,
				news: articlesMode === 'news',
				posts: articlesMode === 'posts'
			})

			if (browser && articlesMode !== 'posts') {
				data.publicationIds.forEach((id) => {
					const article = data.publicationRefs[id]
					cache.set(getArticleQueryKey(id), {
						...article,
						textHtml: '<p>' + article.leadData?.textHtml + '</p>'
					} satisfies Article)
				})
			}

			return data
		}
	)

	return {
		articleParams: articlesParamsResult.data,
		articles,
		articlesMode,
		cache: cache.has(getArticlesQueryKey(articlesParamsResult.data))
	}
}
