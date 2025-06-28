import makeRequest, { type MakeRequestCommonOptions } from '../makeRequest'

type ReadArticleCommentsProps = {
	id: number | string
} & MakeRequestCommonOptions

export default async ({ id, fetch, auth }: ReadArticleCommentsProps) =>
	await makeRequest<{ ok: boolean }>({
		path: `articles/${id}/comments/read`,
		requestOptions: {
			method: 'POST',
			body: '{}',
			headers: {
				'content-type': 'application/json',
				'accept': 'application/json, text/plain, */*'
			}
		},
		version: 2,
		auth,
		fetch
	})
