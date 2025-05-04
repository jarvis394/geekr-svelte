<script lang="ts">
	import dayjs from 'dayjs'
	import calendarPlugin from 'dayjs/plugin/calendar'
	import relativeTimePlugin from 'dayjs/plugin/relativeTime'
	import updateLocalePlugin from 'dayjs/plugin/updateLocale'
	import { useScrollTrigger } from '$lib/hooks/scrollTrigger.svelte'
	import { useLightbox } from '$lib/hooks/lightbox.svelte'
	import { onMount } from 'svelte'
	import { classes, setupViewTransition } from '$lib/utils/transitions'

	import 'dayjs/locale/en'
	import 'dayjs/locale/ru'

	import '../styles/app.css'
	import '../styles/fonts.css'
	import '../styles/transitions.css'
	import 'photoswipe/style.css'

	let { children } = $props()
	const { on } = setupViewTransition({
		shouldStartViewTransition(navigation) {
			// Catches navigation inside the page and disables transition
			if (navigation.from?.route.id === navigation.to?.route.id) {
				return false
			}

			return true
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
	useScrollTrigger()
	useLightbox()

	classes(({ navigation }) => {
		// Catches navigation inside the page and disables transition
		if (navigation.from?.route.id === navigation.to?.route.id) {
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
<main
	class="main selection:text-primary relative mx-auto flex min-h-full w-full max-w-2xl flex-col overscroll-x-none selection:bg-blue-200 dark:selection:bg-sky-900"
>
	{@render children()}
</main>

<style>
	.main {
		padding-top: env(safe-area-inset-top);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
