<script lang="ts">
	import type { OnNavigate } from '@sveltejs/kit'
	import dayjs from 'dayjs'
	import calendarPlugin from 'dayjs/plugin/calendar'
	import relativeTimePlugin from 'dayjs/plugin/relativeTime'
	import updateLocalePlugin from 'dayjs/plugin/updateLocale'
	import { useLightbox } from '$lib/hooks/lightbox.svelte'
	import { onMount } from 'svelte'
	import { classes, setupViewTransition } from '$lib/utils/transitions'
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
	import { Drawer } from '$lib/components/drawer'
	import { Sidebar } from '$lib/components/sidebar'
	import { browser } from '$app/environment'

	import 'dayjs/locale/en'
	import 'dayjs/locale/ru'

	import '../styles/app.css'
	import '../styles/fonts.css'
	import '../styles/transitions.css'
	import 'photoswipe/style.css'

	const shouldStartViewTransition = (navigation: OnNavigate) => {
		const articlesNavigaion = [
			'/flows/[...params]',
			'/articles/[...params]',
			'/news/[...params]',
			'/posts/[...params]'
		]

		// Catches navigation inside the page and disables transition
		if (navigation.from?.route.id === navigation.to?.route.id) {
			return false
		}

		// Catches navigation between /articles and /flows (they are the same route)
		if (
			articlesNavigaion.some((e) => e === navigation.from?.route.id) &&
			articlesNavigaion.some((e) => e === navigation.to?.route.id)
		) {
			return false
		}

		return true
	}

	let { children } = $props()
	const { on } = setupViewTransition({
		shouldStartViewTransition
	})

	const client = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	})

	dayjs.extend(relativeTimePlugin)
	dayjs.extend(calendarPlugin)
	dayjs.extend(updateLocalePlugin)

	dayjs.updateLocale('ru', {
		calendar: {
			lastWeek: 'D MMMM, в hh:mm',
			sameDay: 'Сегодня, в hh:mm',
			lastDay: 'Вчера, в hh:mm',
			sameElse: 'D MMMM, YYYY'
		}
	})
	dayjs.updateLocale('en', {
		calendar: {
			lastWeek: 'D MMMM, at hh:mm',
			sameDay: '[Today, at ]hh:mm',
			lastDay: '[Yesterday, at ]hh:mm',
			sameElse: 'D MMMM, YYYY'
		}
	})

	dayjs.locale('ru')
	useLightbox()

	classes(({ navigation }) => {
		const shouldStartTransition = shouldStartViewTransition(navigation)

		if (!shouldStartTransition) {
			return []
		}

		if (navigation.delta === -1) {
			return ['view-transition', 'leaving']
		}

		return ['view-transition', 'entering']
	}, on)

	onMount(async () => {
		await import('@material/web/ripple/ripple.js')
		document.body.classList.add('hydrated')
	})
</script>

<svelte:head>
	<title>geekr.</title>
</svelte:head>
<QueryClientProvider {client}>
	<main
		id="main"
		class="main relative mx-auto flex min-h-full w-full flex-row justify-center overscroll-x-none"
	>
		<Drawer />
		<div class="container-bordered max-w-article relative h-full w-full shrink">
			{@render children()}
		</div>
		<Sidebar />
	</main>
</QueryClientProvider>

<style>
	.main {
		padding-top: env(safe-area-inset-top);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
