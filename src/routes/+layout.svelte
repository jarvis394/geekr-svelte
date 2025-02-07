<script lang="ts">
	import dayjs from 'dayjs'
	import calendarPlugin from 'dayjs/plugin/calendar'
	import relativeTimePlugin from 'dayjs/plugin/relativeTime'
	import updateLocalePlugin from 'dayjs/plugin/updateLocale'
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

	let { children } = $props()
</script>

<main class="ring-border mx-auto flex min-h-full w-full max-w-xl flex-col ring">
	{@render children()}
</main>
