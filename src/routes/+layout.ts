import { browser } from '$app/environment'
import { SafeArea, SystemBarsStyle } from '@capacitor-community/safe-area'
import { QueryClient } from '@tanstack/svelte-query'

export const ssr = false
export const prerender = false
export const csr = true

export const load = async () => {
	// SafeArea.setSystemBarsStyle({
	// 	statusBarColor: '#00000000', // transparent
	// 	statusBarContent: 'light',
	// 	navigationBarColor: '#00000000', // transparent
	// 	navigationBarContent: 'light'
	// })

	SafeArea.setSystemBarsStyle({
		style: SystemBarsStyle.Light
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
