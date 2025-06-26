import type { CommentsMap } from '$lib/types'
import makeRequest, { type MakeRequestCommonOptions } from '../makeRequest'

type GetArticlePinnedCommentsProps = {
	id: number | string
} & MakeRequestCommonOptions

export default async ({ id, fetch, auth }: GetArticlePinnedCommentsProps) =>
	await makeRequest<CommentsMap>({
		path: `articles/${id}/comments/pinned`,
		version: 2,
		auth,
		fetch
	})
