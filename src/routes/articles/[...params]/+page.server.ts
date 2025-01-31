import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import {
	type ArticlesMode,
	type ArticlesPeriod,
	type ArticlesComplexity,
	type ArticlesRating,
	articlesModeSchema,
	articlesRatingSchema,
	articlesPeriodSchema,
	articlesComplexitySchema,
	articlesPageSchema
} from '$lib/types'
import * as api from '$lib/api'
import type { ZodSchema } from 'zod'

type GetArticlesParamsData = {
	mode: ArticlesMode
	period: ArticlesPeriod
	complexity: ArticlesComplexity
	rating: ArticlesRating
	page: number
}

type GetArticlesParamsResult =
	| {
			success: true
			data: GetArticlesParamsData
	  }
	| {
			success: false
			data: null
	  }

const parseArticlesParams = (params: string[]): GetArticlesParamsResult => {
	const data: GetArticlesParamsData = {
		mode: 'new',
		rating: 'all',
		period: 'daily',
		complexity: 'all',
		page: 1
	}
	const checkMap: Record<keyof GetArticlesParamsData, ZodSchema> = {
		mode: articlesModeSchema,
		rating: articlesRatingSchema,
		period: articlesPeriodSchema,
		complexity: articlesComplexitySchema,
		page: articlesPageSchema
	}

	while (params.length) {
		const param = params.shift()
		let index = 0

		// Skip page param
		if (param === 'p') continue

		for (const item in checkMap) {
			const typedItem = item as keyof GetArticlesParamsData
			const schema = checkMap[typedItem]
			const parseResult = schema.safeParse(param)

			// Remove item from the check map to not do same checks again
			if (parseResult.success) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				data[typedItem] = parseResult.data
				delete checkMap[typedItem]
				break
			}
			// If we exhaust all checks, param is invalid and we should exit
			else {
				index++
				if (index === Object.keys(checkMap).length) {
					return { success: false, data: null }
				}
			}
		}
	}

	if (data.mode === 'top' && data.rating !== 'all') {
		return { success: false, data: null }
	}

	return { success: true, data }
}

const makeArticlesPageUrlFromParams = (articlesParams: GetArticlesParamsData): string => {
	const urlParts: string[] = []

	if (articlesParams.mode === 'top') {
		urlParts.push('top')
		urlParts.push(articlesParams.period || 'daily')
	} else if (articlesParams.rating !== 'all') {
		urlParts.push(articlesParams.rating)
	}

	if (articlesParams.complexity !== 'all') {
		urlParts.push(articlesParams.complexity)
	}

	if (articlesParams.page > 1) {
		urlParts.push('p/' + articlesParams.page)
	}

	const res = urlParts.join('/')

	return res ? '/' + res : ''
}

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
