import { browser } from '$app/environment'
import { SafeArea } from '@capacitor-community/safe-area'
import { QueryClient } from '@tanstack/svelte-query'

export const ssr = false
export const prerender = false
export const csr = true

export const load = async () => {
	SafeArea.enable({
		config: {
			customColorsForSystemBars: true,
			statusBarColor: '#00000000', // transparent
			statusBarContent: 'light',
			navigationBarColor: '#00000000', // transparent
			navigationBarContent: 'light'
		}
	})

	const client = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	})

	return { client }
}
