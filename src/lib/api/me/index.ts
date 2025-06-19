import type { MostReadingArticlesResponse } from '$lib/types'
import makeRequest, { type FetchProp } from '../makeRequest'

type GetMeProps = FetchProp

export default async ({ fetch }: GetMeProps = {}) =>
	await makeRequest<MostReadingArticlesResponse>({
		path: `me`,
		version: 2,
		fetch
	})
