import type { ArticlesFlow, ArticlesPeriod, ArticlesRating, ArticlesResponse } from '$lib/types'
import makeRequest, { type FetchAndAuthProp } from '../makeRequest'

export const postsModeParams: Record<
	ArticlesPeriod | ArticlesRating,
	{ sort: 'all'; score?: string } | { sort: 'top'; period: ArticlesPeriod }
> = {
	all: { sort: 'all' },
	rated0: { sort: 'all', score: '0' },
	rated10: { sort: 'all', score: '10' },
	rated25: { sort: 'all', score: '25' },
	rated50: { sort: 'all', score: '50' },
	rated100: { sort: 'all', score: '100' },
	daily: { sort: 'top', period: 'daily' },
	weekly: { sort: 'top', period: 'weekly' },
	monthly: { sort: 'top', period: 'monthly' },
	yearly: { sort: 'top', period: 'yearly' },
	alltime: { sort: 'top', period: 'alltime' }
}

type GetPostsProps = {
	mode: ArticlesPeriod | ArticlesRating
	page: number
	hubAlias?: string
	flow?: ArticlesFlow
	perPage?: number
	news?: boolean
	posts?: boolean
} & FetchAndAuthProp

export default async ({
	mode,
	page,
	hubAlias,
	flow = 'all',
	perPage = 20,
	news,
	posts,
	auth,
	fetch
}: GetPostsProps) =>
	await makeRequest<ArticlesResponse>({
		path: 'articles',
		version: 2,
		params: {
			...postsModeParams[mode],
			sort: flow === 'all' ? postsModeParams[mode].sort : 'all',
			page: page.toString(),
			hub: hubAlias || '',
			flow: flow === 'all' ? '' : flow,
			perPage: perPage.toString(),
			...(news && { news: 'true' }),
			...(posts && { posts: 'true' })
		},
		auth,
		fetch
	})
