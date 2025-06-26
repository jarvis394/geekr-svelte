import { articleLoader } from '$lib/pages/article'

export const load = ({ params, fetch }) => articleLoader({ id: params.id, fetch })

export const ssr = true
export const csr = true
