import makeRequest from '$lib/api/makeRequest'
import { json } from '@sveltejs/kit'

const BYPASS_HEADERS = ['etag', 'set-cookie', 'date', 'server-habr-version']

export const fallback = async ({ params, url, request, fetch }) => {
	const { params: path, version } = params
	const searchParams = Object.fromEntries(url.searchParams.entries())
	const res = await makeRequest({
		path,
		params: searchParams,
		version: Number(version.slice(1)) as 1 | 2,
		requestOptions: {
			method: request.method,
			headers: request.headers
		},
		auth: false,
		fetch
	})
	const headers = new Headers()
	const { status = 200, statusText = 'OK' } = res._response || {}
	BYPASS_HEADERS.forEach((key) => {
		const value = res._response?.headers.get(key)
		if (value) headers.append(key, value)
	})

	// Handle Not Modified result
	if (status === 304) {
		return new Response(null, {
			headers,
			status,
			statusText
		})
	}

	delete res._response

	return json(res, {
		headers,
		status,
		statusText
	})
}
