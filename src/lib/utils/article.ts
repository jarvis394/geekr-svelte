import { type Article } from '$lib/types'

export const getArticleQueryKey = (id: Article['id']) => {
	return ['article', id].join(':')
}
