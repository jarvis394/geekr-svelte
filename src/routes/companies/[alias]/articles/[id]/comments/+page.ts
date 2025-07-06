import type { PageLoad } from './$types'
import { articleCommentsLoader } from '$lib/pages/article-comments'

export const load: PageLoad = ({ params, fetch, data }) => {
  if (data) return data
  return articleCommentsLoader({ id: params.id, fetch })
}

export const ssr = true
export const csr = true
