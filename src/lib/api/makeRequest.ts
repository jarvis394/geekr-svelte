import { API_URL } from '$lib/config/constants'
import type { APIError } from '$lib/types'
import { error } from '@sveltejs/kit'

export type FetchProp = {
	/** Fetch function */
	fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
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
} & FetchProp

export default async <T = never>({
	language = 'ru',
	path,
	params,
	requestOptions,
	version = 2,
	fetch: propsFetch
}: MakeRequestProps): Promise<T> => {
	const searchParams = new URLSearchParams(params)
	searchParams.append('fl', language)
	searchParams.append('hl', language)

	const fetchFunction = propsFetch || fetch
	const req = await fetchFunction(API_URL + `v${version}/` + path + '?' + searchParams.toString(), {
		method: requestOptions?.method || 'get',
		...requestOptions
	})

	const res = (await req.json()) as (T & { errorCode?: never }) | APIError

	if (res.errorCode) {
		throw error(res.httpCode, res.message)
	}

	return res as T
}
