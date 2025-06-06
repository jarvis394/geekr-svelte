import type { PageLoad } from './$types'
import { articlesLoader } from '$lib/pages/articles'

export const load: PageLoad = (props) => articlesLoader({ ...props, articlesMode: 'news' })
