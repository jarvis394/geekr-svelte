import type { MostReadingArticlesResponse } from '$lib/types'
import makeRequest, { type FetchAndAuthProp } from '../makeRequest'

type GetMostReadingArticlesProps = FetchAndAuthProp

export default async ({ fetch, auth }: GetMostReadingArticlesProps = {}) =>
	await makeRequest<MostReadingArticlesResponse>({
		path: `articles/most-reading`,
		version: 2,
		auth,
		fetch
	})
