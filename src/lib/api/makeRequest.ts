import { API_URL } from '$lib/config/constants'

interface MakeRequestProps {
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

	/** Fetch function */
	fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
}

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

	return (await req.json()) as T
}
