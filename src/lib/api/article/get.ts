import type { Article } from '$lib/types'
import makeRequest, { type FetchAndAuthProp } from '../makeRequest'

type GetArticleProps = {
	id: number | string
} & FetchAndAuthProp

export default async ({ id, fetch, auth }: GetArticleProps) =>
	await makeRequest<Article>({
		path: `articles/${id}`,
		version: 2,
		auth,
		fetch
	})
