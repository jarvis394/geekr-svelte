import type { PageLoad } from './$types'
import * as api from '$lib/api'

export const load: PageLoad = async ({ params, fetch }) => {
	const article = api.article.get({
		id: params.id,
		fetch
	})

	return {
		maxage: 3600,
		article
	}
}
