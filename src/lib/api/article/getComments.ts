import type { APIResponseComments } from '$lib/types'
import makeRequest from '../makeRequest'

interface GetArticleCommentsProps {
	id: number | string
	fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
}

export default async ({ id, fetch }: GetArticleCommentsProps) =>
	await makeRequest<APIResponseComments>({
		path: `articles/${id}/comments`,
		params: {
			nocount: '1'
		},
		version: 2,
		fetch
	})
