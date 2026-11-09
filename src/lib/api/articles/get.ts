import type {
	ArticlesComplexity,
	ArticlesFlow,
	ArticlesPeriod,
	ArticlesRating,
	ArticlesResponse
} from '$lib/types'
import makeRequest, { type MakeRequestCommonOptions } from '../makeRequest'

export const modeParams: Record<
	ArticlesPeriod | ArticlesRating,
	{ sort: 'rating'; score?: string } | { sort: 'date'; period: ArticlesPeriod }
> = {
	all: { sort: 'rating' },
	rated0: { sort: 'rating', score: '0' },
	rated10: { sort: 'rating', score: '10' },
	rated25: { sort: 'rating', score: '25' },
	rated50: { sort: 'rating', score: '50' },
	rated100: { sort: 'rating', score: '100' },
	daily: { sort: 'date', period: 'daily' },
	weekly: { sort: 'date', period: 'weekly' },
	monthly: { sort: 'date', period: 'monthly' },
	yearly: { sort: 'date', period: 'yearly' },
	alltime: { sort: 'date', period: 'alltime' }
}

type GetArticlesProps = {
	mode: ArticlesPeriod | ArticlesRating
	page: number
	complexity?: ArticlesComplexity
	hubAlias?: string
	flow?: ArticlesFlow
	perPage?: number
} & MakeRequestCommonOptions

const getQueryParams = (
	mode: ArticlesPeriod | ArticlesRating,
	flow: ArticlesFlow,
	hubAlias?: string
): Record<string, string> => {
	// Hubs and flows use `sort=all` with either `score` or `period` filter
	if (hubAlias || flow !== 'all') {
		const filters: Record<string, string> = { ...modeParams[mode] }
		delete filters.sort
		return {
			...filters,
			...(hubAlias ? { queryType: 'hubs', hub: hubAlias } : { queryType: 'flows_new', flow }),
			sort: 'all'
		}
	}

	return { queryType: 'articles', ...modeParams[mode] }
}

export default async ({
	mode,
	page,
	hubAlias,
	flow = 'all',
	complexity,
	perPage = 20,
	auth,
	fetch
}: GetArticlesProps) =>
	await makeRequest<ArticlesResponse>({
		path: 'articles',
		version: 2,
		auth,
		params: {
			...getQueryParams(mode, flow, hubAlias),
			page: page.toString(),
			perPage: perPage.toString(),
			...(complexity && complexity !== 'all' && { complexity })
		},
		fetch
	})
