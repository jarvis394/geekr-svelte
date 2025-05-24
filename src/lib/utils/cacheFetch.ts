import { browser } from '$app/environment'

export const cache = new Map()

export const cacheFetch = async <T>(key: string, fetchCallback: () => Promise<T>) => {
	if (browser && cache.has(key)) {
		const data = cache.get(key) as T
		return data
	}

	const response = await fetchCallback()
	cache.set(key, response)

	return response
}
