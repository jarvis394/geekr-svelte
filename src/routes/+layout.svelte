<script lang="ts">
	import dayjs from 'dayjs'
	import calendarPlugin from 'dayjs/plugin/calendar'
	import relativeTimePlugin from 'dayjs/plugin/relativeTime'
	import updateLocalePlugin from 'dayjs/plugin/updateLocale'
	import transitions from '$lib/transitions'

	import 'dayjs/locale/en'
	import 'dayjs/locale/ru'

	import '../styles/app.css'
	import '../styles/fonts.css'

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

	let { children } = $props()
</script>

<main class="w-ful main relative mx-auto flex min-h-full w-full max-w-xl flex-col">
	{@render children()}
</main>

<style>
	.main::after,
	.main::before {
		border-right: 1px solid hsl(var(--border) / 1);
		content: '';
		z-index: 100000;
		transform: translateX(-50%);
		top: 0;
		height: 100%;
		position: fixed;
		pointer-events: none;
	}

	.main::before {
		left: calc(50% - var(--container-xl) / 2);
	}

	.main::after {
		right: calc(50% - var(--container-xl) / 2 - 1px);
	}
</style>
