import type { Article } from '$lib/types'
import makeRequest, { type FetchProp } from '../makeRequest'

type GetArticleProps = {
	id: number | string
} & FetchProp

export default async ({ id, fetch }: GetArticleProps) =>
	await makeRequest<Article>({
		path: `articles/${id}`,
		version: 2,
		fetch
	})
