import type { PageLoad } from './$types'
import { articleLoader } from '$lib/utils/article'

export const load: PageLoad = ({ params, fetch }) => articleLoader({ id: params.id, fetch })
