<script lang="ts">
	import { page } from '$app/state'
	import StickyBox from '../sticky-box/sticky-box.svelte'
	import { cn } from '$lib/utils'

	const articlesPages = new Set([
		'/articles/[...params]',
		'/flows/[...params]',
		'/news/[...params]',
		'/posts/[...params]'
	])
	const articlePages = new Set([
		'/articles/[id=article]',
		'/companies/[alias]/articles/[id]',
		'/news/[id=article]',
		'/posts/[id=article]'
	])
	const currentRoute = $derived(page.route.id || '')
</script>

<StickyBox
	style="view-transition-name: sidebar-articles; will-change: position, top;"
	class={cn(
		'top-0 z-50 h-fit w-[var(--sidebar-width)] shrink transform-gpu px-3 py-2 pt-1 max-lg:hidden'
	)}
>
	{#if articlesPages.has(currentRoute)}
		{#await import('./articles/articles-sidebar.svelte') then C}
			<C.default />
		{/await}
	{:else if articlePages.has(currentRoute)}
		{#await import('./article/article-sidebar.svelte') then C}
			<C.default />
		{/await}
	{/if}
</StickyBox>
