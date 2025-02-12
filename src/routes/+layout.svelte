<script lang="ts">
	import dayjs from 'dayjs'
	import calendarPlugin from 'dayjs/plugin/calendar'
	import relativeTimePlugin from 'dayjs/plugin/relativeTime'
	import updateLocalePlugin from 'dayjs/plugin/updateLocale'
	import transitions from '$lib/utils/transitions'
	import { scrollTrigger } from '$lib/hooks/scrollTrigger.svelte'

	import 'dayjs/locale/en'
	import 'dayjs/locale/ru'

	import '../styles/app.css'
	import '../styles/fonts.css'
	import 'photoswipe/style.css'
	import { onMount } from 'svelte'

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

	transitions.onNavigateViewTransition()

	scrollTrigger()

	let { children } = $props()

	onMount(async () => {
		await import('@material/web/ripple/ripple.js')
	})
</script>

<svelte:head>
	<title>geekr.</title>
</svelte:head>
<main
	class="main selection:text-primary relative mx-auto flex min-h-full w-full max-w-xl flex-col overscroll-x-none selection:bg-blue-200 dark:selection:bg-sky-950"
>
	{@render children()}
</main>

<style>
	.main {
		padding-top: env(safe-area-inset-top);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
