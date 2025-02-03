import type { Article } from '$lib/types'
import makeRequest from '../makeRequest'

interface GetArticleProps {
	id: number | string
	fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
}

export default async ({ id, fetch }: GetArticleProps) =>
	await makeRequest<Article>({
		path: `articles/${id}`,
		version: 2,
		fetch
	})
