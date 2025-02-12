import type { PageServerLoad } from './$types'
import * as api from '$lib/api'

export const load: PageServerLoad = async ({ params }) => {
	const comments = api.article.getComments({
		id: params.id
	})

	return {
		comments
	}
}
