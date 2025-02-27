import type { PageLoad } from './$types'
import * as api from '$lib/api'

export const load: PageLoad = async ({ params, fetch }) => {
	const comments = api.article.getComments({
		id: params.id,
		fetch
	})

	return {
		comments
	}
}
