import type { CommentsMap } from '$lib/types'
import makeRequest, { type FetchAndAuthProp } from '../makeRequest'

type GetArticlePinnedCommentsProps = {
	id: number | string
} & FetchAndAuthProp

export default async ({ id, fetch, auth }: GetArticlePinnedCommentsProps) =>
	await makeRequest<CommentsMap>({
		path: `articles/${id}/comments/pinned`,
		version: 2,
		auth,
		fetch
	})
