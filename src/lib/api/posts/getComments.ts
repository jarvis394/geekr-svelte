import type { APIResponseComments } from '$lib/types'
import makeRequest, { type MakeRequestCommonOptions } from '../makeRequest'

type GetArticleCommentsProps = {
	id: number | string
} & MakeRequestCommonOptions

export default async ({ id, fetch, auth }: GetArticleCommentsProps) =>
	await makeRequest<APIResponseComments>({
		path: `threads/${id}/comments`,
		version: 2,
		auth,
		fetch
	})
