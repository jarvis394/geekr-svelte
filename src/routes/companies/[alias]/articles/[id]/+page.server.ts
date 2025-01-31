import type { PageServerLoad } from './$types'
import * as api from '$lib/api'

export const load: PageServerLoad = ({ params }) => {
	const article = api.article.get({
		id: params.id
	})

	return {
		article
	}
}
