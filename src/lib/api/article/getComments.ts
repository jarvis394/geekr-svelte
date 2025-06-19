import type { APIResponseComments } from '$lib/types'
import makeRequest, { type FetchAndAuthProp } from '../makeRequest'

type GetArticleCommentsProps = {
	id: number | string
} & FetchAndAuthProp

export default async ({ id, fetch, auth }: GetArticleCommentsProps) =>
	await makeRequest<APIResponseComments>({
		path: `articles/${id}/comments`,
		params: {
			nocount: '1'
		},
		version: 2,
		auth,
		fetch
	})
