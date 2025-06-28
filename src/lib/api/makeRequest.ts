import { API_URL } from '$lib/config/constants'
import type { APIError } from '$lib/types'
import { parseCookies } from '$lib/utils'
import { Capacitor } from '@capacitor/core'
import { error } from '@sveltejs/kit'

export type MakeRequestCommonOptions = {
	/** Fetch function */
	fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
	/** Use authorized API */
	auth?: boolean
}

export type MakeRequestProps = {
	/** API response language */
	language?: 'ru' | 'en'

	/** API method as an URL path */
	path: string

	/** Query parameters */
	params?: Record<string, string>

	/** Fetch request options */
	requestOptions?: RequestInit

	/** API version */
	version?: 1 | 2
} & MakeRequestCommonOptions

export type MakeRequestResult<T> = {
	response?: Response
	data: T
}

export default async <T = object>({
	path,
	params,
	requestOptions,
	version = 2,
	language = 'ru',
	fetch: propsFetch,
	auth: propsAuth
}: MakeRequestProps): Promise<MakeRequestResult<T | null>> => {
	const cookies = typeof document !== 'undefined' && parseCookies(document.cookie)
	const searchParams = new URLSearchParams(params)
	searchParams.append('fl', language)
	searchParams.append('hl', language)

	const fetchFunction = propsFetch || fetch
	const isAuthorized = cookies && cookies['is-authorized'] === 'true'
	const csrfToken = cookies && cookies['csrf-token']
	const habrUserUUID = cookies && cookies['habr_uuid']
	// On a native platform we should use a patched fetch function instead of server API
	const auth = Capacitor.isNativePlatform() ? false : propsAuth || isAuthorized
	const apiUrl = auth ? '/api/' : API_URL
	const res = await fetchFunction(apiUrl + `v${version}/` + path + '?' + searchParams.toString(), {
		method: requestOptions?.method || 'get',
		headers: {
			...requestOptions?.headers,
			...(csrfToken && { 'csrf-token': csrfToken }),
			...(habrUserUUID && { 'habr-user-uuid': habrUserUUID })
		},
		// Include cross-origin cookies on native platform as fetch function is patched
		credentials: Capacitor.isNativePlatform() ? 'include' : 'same-origin',
		...requestOptions
	})

	try {
		const text = await res.text()
		if (!text) {
			return { response: res, data: null }
		}

		const data = JSON.parse(text) as (T & { errorCode?: never }) | APIError
		if (data.errorCode) {
			throw error(data.httpCode, data.message)
		}

		return { data: data as T, response: res }
	} catch (e) {
		throw error(500, (e as Error).message)
	}
}
