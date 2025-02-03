import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import * as api from '$lib/api'
import { parseArticlesParams, makeArticlesPageUrlFromParams } from '$lib/utils/articles'

export const load: PageServerLoad = ({ params, url }) => {
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
	const articles = api.articles.get({
		mode: mode === 'new' ? rating : period,
		page,
		complexity
	})

	return {
		articleParams: articlesParamsResult.data,
		articles
	}
}
