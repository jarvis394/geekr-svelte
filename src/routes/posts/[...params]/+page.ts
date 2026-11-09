import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

// Habr removed this section, keep old links working
export const load: PageLoad = () => redirect(301, '/articles')
