import { API_URL } from '$lib/config/constants'
import axios, { type AxiosRequestConfig } from 'axios'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

interface MakeRequestProps {
	/** API response language */
	language?: 'ru' | 'en'

	/** API method as an URL path */
	path: string

	/** Query parameters */
	params?: Record<string, string>

	/** Axios request options */
	requestOptions?: AxiosRequestConfig

	/** API version */
	version?: 1 | 2
}

export default async <T = never>({
	language = 'ru',
	path,
	params,
	requestOptions,
	version = 2
}: MakeRequestProps): Promise<T> => {
	const tokenRequestParams = new URLSearchParams(params)
	tokenRequestParams.append('fl', language)
	tokenRequestParams.append('hl', language)

	return (
		await axios({
			method: requestOptions?.method || 'get',
			url: API_URL + `v${version}/` + path,
			params: {
				fl: language,
				hl: language,
				...params
			},
			cancelToken: source.token,
			...requestOptions
		})
	).data as T
}
