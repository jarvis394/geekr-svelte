<script lang="ts">
	import dayjs from 'dayjs'
	import calendarPlugin from 'dayjs/plugin/calendar'
	import relativeTimePlugin from 'dayjs/plugin/relativeTime'
	import updateLocalePlugin from 'dayjs/plugin/updateLocale'
	import { scrollTrigger } from '$lib/hooks/scrollTrigger.svelte'
	import { setupViewTransition } from 'sveltekit-view-transition'
	import { onMount } from 'svelte'

	import 'dayjs/locale/en'
	import 'dayjs/locale/ru'

	import '../styles/app.css'
	import '../styles/fonts.css'
	import '../styles/transitions.css'
	import 'photoswipe/style.css'

	let { children } = $props()
	const { classes } = setupViewTransition()

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
	scrollTrigger()

	classes(({ navigation }) => {
		// Catches navigation inside article page and disables transition
		if (
			navigation.from?.route.id === navigation.to?.route.id &&
			navigation.from?.params?.id === navigation.to?.params?.id
		) {
			return []
		}

		if (navigation.type === 'popstate') {
			return ['leaving']
		}

		return ['entering']
	})

	onMount(async () => {
		await import('@material/web/ripple/ripple.js')
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
