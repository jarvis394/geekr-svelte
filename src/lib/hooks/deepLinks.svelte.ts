import { App, type URLOpenListenerEvent } from '@capacitor/app'
import { onMount } from 'svelte'
import { goto } from '$app/navigation'
import { formatLink } from '$lib/utils'

export const useDeepLinks = () => {
	onMount(() => {
		App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
			const slug = formatLink(event.url)
			if (slug) {
				goto(slug)
			}
		})
	})
}
