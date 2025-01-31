import type { Article } from '$lib/types'
import makeRequest from '../makeRequest'

interface GetArticleProps {
	id: number | string
}

export default async ({ id }: GetArticleProps) =>
	await makeRequest<Article>({
		path: `articles/${id}`,
		version: 2
	})
