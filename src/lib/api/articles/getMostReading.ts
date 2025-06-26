import type { MostReadingArticlesResponse } from '$lib/types'
import makeRequest, { type MakeRequestCommonOptions } from '../makeRequest'

type GetMostReadingArticlesProps = MakeRequestCommonOptions

export default async ({ fetch, auth }: GetMostReadingArticlesProps = {}) =>
	await makeRequest<MostReadingArticlesResponse>({
		path: `articles/most-reading`,
		version: 2,
		auth,
		fetch
	})
