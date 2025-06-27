import { goto } from '$app/navigation'
import { makeArticlesPageUrlFromParams } from '$lib/utils'
import getCachedMode from '$lib/utils/getCachedMode'

export const load = async () => {
	return goto(makeArticlesPageUrlFromParams(getCachedMode()), {
		replaceState: true
	})
}

export const ssr = false
