import { makeArticlesPageUrlFromParams } from '$lib/utils'
import getCachedMode from '$lib/utils/getCachedMode'
import { redirect } from '@sveltejs/kit'

export const load = async () => {
	return redirect(302, '/articles' + makeArticlesPageUrlFromParams(getCachedMode()))
}

export const ssr = false
