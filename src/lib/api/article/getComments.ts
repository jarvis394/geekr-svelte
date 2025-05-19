import type { APIResponseComments } from '$lib/types'
import makeRequest, { type FetchProp } from '../makeRequest'

type GetArticleCommentsProps = {
	id: number | string
} & FetchProp

export default async ({ id, fetch }: GetArticleCommentsProps) =>
	await makeRequest<APIResponseComments>({
		path: `articles/${id}/comments`,
		params: {
			nocount: '1'
		},
		version: 2,
		fetch
	})
