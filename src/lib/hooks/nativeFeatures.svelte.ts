import { App, type URLOpenListenerEvent } from '@capacitor/app'
import { onMount } from 'svelte'
import { goto } from '$app/navigation'
import { formatLink } from '$lib/utils'

export const useNativeFeatures = () => {
	onMount(async () => {
		App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
			const slug = formatLink(event.url)
			if (slug) {
				goto(slug)
			}
		})

		App.addListener('backButton', ({ canGoBack }) => {
			if (!canGoBack) {
				App.exitApp()
			} else {
				history.back()
			}
		})
	})
}
