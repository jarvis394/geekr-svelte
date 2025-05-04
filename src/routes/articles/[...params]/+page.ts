import { error, redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
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

export const load: PageLoad = ({ params, url, fetch }) => {
	const articlesParamsResult = parseArticlesParams(params.params.split('/'))
	const urlFromParams =
		articlesParamsResult.data &&
		'/articles' + makeArticlesPageUrlFromParams(articlesParamsResult.data)

	if (!articlesParamsResult.success) {
		throw error(404, 'Not Found')
	}

	if (urlFromParams && urlFromParams !== url.pathname) {
		return redirect(302, urlFromParams)
	}

	const { complexity, mode, page, period, rating } = articlesParamsResult.data
	const articles = cacheFetch(getArticlesQueryKey(articlesParamsResult.data), async () => {
		const data = await api.articles.get({
			mode: mode === 'new' ? rating : period,
			page,
			complexity,
			fetch
		})

		if (browser) {
			data.publicationIds.forEach((id) => {
				const article = data.publicationRefs[id]
				cache.set(getArticleQueryKey(id), {
					...article,
					textHtml: '<p>' + article.leadData.textHtml + '</p>'
				} satisfies Article)
			})
		}

		return data
	})

	return {
		articleParams: articlesParamsResult.data,
		articles
	}
}
