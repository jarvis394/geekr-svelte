import { articleLoader } from '$lib/pages/article'

export const load = ({ params, fetch }) =>
	articleLoader({ id: params.id, fetch, isCorporative: true })

export const ssr = true
export const csr = true
