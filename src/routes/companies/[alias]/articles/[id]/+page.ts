import type { PageLoad } from './$types'
import { articleLoader } from '$lib/pages/article'

export const load: PageLoad = ({ params, fetch }) =>
	articleLoader({ id: params.id, fetch, isCorporative: true })

export const ssr = true
export const csr = true
