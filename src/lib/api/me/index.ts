import type { MostReadingArticlesResponse } from '$lib/types'
import makeRequest, { type MakeRequestCommonOptions } from '../makeRequest'

type GetMeProps = MakeRequestCommonOptions

export default async ({ fetch, auth = true }: GetMeProps = {}) =>
	await makeRequest<MostReadingArticlesResponse>({
		path: `me`,
		version: 2,
		auth,
		fetch
	})
