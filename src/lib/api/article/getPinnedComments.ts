import type { CommentsMap } from '$lib/types'
import makeRequest, { type FetchProp } from '../makeRequest'

type GetArticlePinnedCommentsProps = {
	id: number | string
} & FetchProp

export default async ({ id, fetch }: GetArticlePinnedCommentsProps) =>
	await makeRequest<CommentsMap>({
		path: `articles/${id}/comments/pinned`,
		version: 2,
		fetch
	})
