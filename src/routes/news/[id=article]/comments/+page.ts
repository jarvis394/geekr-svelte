import type { PageLoad } from './$types'
import { articleCommentsLoader } from '$lib/pages/article-comments'

export const load: PageLoad = ({ params, fetch }) => articleCommentsLoader({ id: params.id, fetch })
