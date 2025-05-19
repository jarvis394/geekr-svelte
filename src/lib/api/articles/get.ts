import type {
	ArticlesComplexity,
	ArticlesFlow,
	ArticlesPeriod,
	ArticlesRating,
	ArticlesResponse
} from '$lib/types'
import makeRequest, { type FetchProp } from '../makeRequest'

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
} & FetchProp

export default async ({
	mode,
	page,
	hubAlias,
	flow = 'all',
	complexity,
	perPage = 20,
	fetch
}: GetArticlesProps) =>
	await makeRequest<ArticlesResponse>({
		path: 'articles',
		version: 2,
		params: {
			...modeParams[mode],
			sort: flow === 'all' ? modeParams[mode].sort : 'all',
			page: page.toString(),
			hub: hubAlias || '',
			flow: flow === 'all' ? '' : flow,
			perPage: perPage.toString(),
			...(complexity && complexity !== 'all' && { complexity })
		},
		fetch
	})
