import type { MostReadingArticlesResponse } from '$lib/types'
import makeRequest, { type FetchProp } from '../makeRequest'

type GetMostReadingArticlesProps = FetchProp

export default async ({ fetch }: GetMostReadingArticlesProps = {}) =>
	await makeRequest<MostReadingArticlesResponse>({
		path: `articles/most-reading`,
		version: 2,
		fetch
	})
