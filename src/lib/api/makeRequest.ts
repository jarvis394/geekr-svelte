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

	/** Use authorizated route */
	auth?: boolean
} & FetchProp

export type MakeRequestResult<T> = T & {
	_response?: Response
}

export default async <T = object>({
	language = 'ru',
	path,
	params,
	requestOptions,
	version = 2,
	fetch: propsFetch,
	auth = true
}: MakeRequestProps): Promise<MakeRequestResult<T>> => {
	const searchParams = new URLSearchParams(params)
	searchParams.append('fl', language)
	searchParams.append('hl', language)

	const fetchFunction = propsFetch || fetch
	const res = await fetchFunction(
		(auth ? '/api/' : API_URL) + `v${version}/` + path + '?' + searchParams.toString(),
		{
			method: requestOptions?.method || 'get',
			...requestOptions
		}
	)

	try {
		const text = await res.text()
		
		if (!text) return { _response: res } as MakeRequestResult<T>
		
		const data = JSON.parse(text) as (T & { errorCode?: never }) | APIError
		if (data.errorCode) {
			throw error(data.httpCode, data.message)
		}

		return { ...(data as T), _response: res }
	} catch (e) {
		throw error(500, (e as Error).message)
	}
}
