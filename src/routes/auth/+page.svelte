<script lang="ts">
	import { InAppBrowser, ToolBarType } from '@capgo/inappbrowser'
	import { onMount } from 'svelte'
	import { LoaderCircle } from '@lucide/svelte'
	import { CapacitorCookies } from '@capacitor/core'

	let logs = $state<string[]>([])

	const handleLogin = async () => {
		await InAppBrowser.close()

		const cookies = await InAppBrowser.getCookies({
			url: 'https://habr.com'
		})
		const cookiePromises: Array<Promise<void>> = [
			CapacitorCookies.setCookie({
				path: '/',
				key: 'is-authorized',
				value: 'true'
			})
		]

		for (const key in cookies) {
			cookiePromises.push(
				CapacitorCookies.setCookie({
					path: '/',
					key,
					value: cookies[key]
				})
			)
		}

		await Promise.all(cookiePromises)
	}

	onMount(async () => {
		InAppBrowser.addListener('urlChangeEvent', async (data) => {
			// We can only access this page when auth succeded (https://habr.com/ru/articles)
			if (data.url.includes('/articles')) {
				await handleLogin()
			}
		})

		InAppBrowser.addListener('closeEvent', async () => {
			logs.push(
				JSON.stringify(
					await InAppBrowser.getCookies({
						url: 'https://habr.com'
					})
				)
			)
		})

		await InAppBrowser.openWebView({
			url: 'https://habr.com/kek/v1/auth/habrahabr/?back=/ru/all/&hl=ru',
			toolbarType: ToolBarType.COMPACT,
			isPresentAfterPageLoad: true,
			title: 'Хабр Аккаунт',
			activeNativeNavigationForWebview: true,
			disableGoBackOnNativeApplication: true,
			ignoreUntrustedSSLError: true,
			materialPicker: true,
			showArrow: true,
			showReloadButton: true,
			toolbarColor: '#000000'
		})
	})
</script>

{#if logs.length === 0}
	<div class="flex w-full items-center justify-center py-16">
		<LoaderCircle class="animate-spin" />
	</div>
{/if}

<div class="article px-4 py-4">
	{#each logs as log}
		<p>{log}</p>
	{/each}
</div>
