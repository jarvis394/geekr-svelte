import type { MostReadingArticlesResponse } from '$lib/types'
import makeRequest, { type FetchAndAuthProp } from '../makeRequest'

type GetMeProps = FetchAndAuthProp

export default async ({ fetch, auth = true }: GetMeProps = {}) =>
	await makeRequest<MostReadingArticlesResponse>({
		path: `me`,
		version: 2,
		auth,
		fetch
	})
