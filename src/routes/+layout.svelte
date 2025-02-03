<script lang="ts">
	import dayjs from 'dayjs'
	import calendarPlugin from 'dayjs/plugin/calendar'
	import relativeTimePlugin from 'dayjs/plugin/relativeTime'
	import updateLocalePlugin from 'dayjs/plugin/updateLocale'

	import '../styles/app.css'
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte'

	dayjs.extend(relativeTimePlugin)
	dayjs.extend(calendarPlugin)
	dayjs.extend(updateLocalePlugin)

	// dayjs.updateLocale('ru', {
	// 	calendar: {
	// 		lastWeek: 'D MMMM, в hh:mm',
	// 		sameDay: 'Сегодня, в hh:mm',
	// 		lastDay: 'Вчера, в hh:mm',
	// 		sameElse: 'D MMMM, YYYY'
	// 	}
	// })
	// dayjs.updateLocale('en', {
	// 	calendar: {
	// 		lastWeek: 'D MMMM, at hh:mm',
	// 		sameDay: 'Today, at hh:mm',
	// 		lastDay: 'Yesterday, at hh:mm',
	// 		sameElse: 'D MMMM, YYYY'
	// 	}
	// })

	let { children } = $props()
</script>

<main class="ring-border mx-auto flex min-h-full w-full max-w-xl flex-col gap-2 ring">
	{@render children()}
</main>
