import {
	type ArticlesMode,
	type ArticlesPeriod,
	type ArticlesComplexity,
	type ArticlesRating,
	type ArticlesFlow,
	articlesModeSchema,
	articlesRatingSchema,
	articlesPeriodSchema,
	articlesComplexitySchema,
	articlesPageSchema,
	articlesFlowSchema
} from '$lib/types'
import type { ZodSchema } from 'zod'

export type GetArticlesParamsData = {
	mode: ArticlesMode
	period: ArticlesPeriod
	complexity: ArticlesComplexity
	rating: ArticlesRating
	page: number
	flow: ArticlesFlow
}

export type GetArticlesParamsResult =
	| {
			success: true
			data: GetArticlesParamsData
	  }
	| {
			success: false
			data: null
	  }

export const parseArticlesParams = (params: string[]): GetArticlesParamsResult => {
	const data: GetArticlesParamsData = {
		mode: 'new',
		rating: 'all',
		period: 'daily',
		complexity: 'all',
		flow: 'all',
		page: 1
	}
	/** NOTE: article params are checked by the order in this map */
	const checkMap: Record<keyof GetArticlesParamsData, ZodSchema> = {
		flow: articlesFlowSchema,
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
		// These are checked by just using routing
		if (param === 'flows') continue
		if (param === 'articles') continue
		if (param === 'news') continue
		if (param === 'posts') continue

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

export const makeArticlesPageUrlFromParams = (
	articlesParams: Partial<GetArticlesParamsData>
): string => {
	const urlParts: string[] = []

	if (articlesParams.flow && articlesParams.flow !== 'all') {
		urlParts.push('flows')
		urlParts.push(articlesParams.flow)
	} else {
		urlParts.push('articles')
	}

	if (articlesParams.mode === 'top') {
		urlParts.push('top')
		urlParts.push(articlesParams.period || 'daily')
	} else if (articlesParams.rating !== 'all' && articlesParams.rating) {
		urlParts.push(articlesParams.rating)
	}

	if (articlesParams.complexity !== 'all' && articlesParams.complexity) {
		urlParts.push(articlesParams.complexity)
	}

	if (articlesParams.page !== undefined && articlesParams.page > 1) {
		urlParts.push('p/' + articlesParams.page)
	}

	const res = urlParts.join('/')

	return res ? '/' + res : ''
}

export const getArticlesQueryKey = (articleParams: GetArticlesParamsData) => {
	return [
		'articles',
		articleParams.flow,
		articleParams.mode,
		articleParams.period,
		articleParams.rating,
		articleParams.complexity,
		articleParams.page
	].join(':')
}
