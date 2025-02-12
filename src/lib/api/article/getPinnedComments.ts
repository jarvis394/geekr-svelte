import type { CommentsMap } from '$lib/types'
import makeRequest from '../makeRequest'

interface GetArticlePinnedCommentsProps {
	id: number | string
	fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
}

export default async ({ id, fetch }: GetArticlePinnedCommentsProps) =>
	await makeRequest<CommentsMap>({
		path: `articles/${id}/comments/pinned`,
		version: 2,
		fetch
	})
