export const parseCookies = (cookieString: string) => {
	const cookies: Record<string, string> = {}

	if (cookieString) {
		cookieString.split(';').forEach((cookie) => {
			const parts = cookie.split('=')
			const name = decodeURIComponent(parts[0].trim())
			const value = decodeURIComponent(parts.slice(1).join('='))
			cookies[name] = value
		})
	}

	return cookies
}
