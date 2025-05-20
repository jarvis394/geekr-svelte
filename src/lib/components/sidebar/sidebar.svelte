<script lang="ts">
	import { page } from '$app/state'
	import StickyBox from '../sticky-box/sticky-box.svelte'
	import ArticlesSidebar from './articles/articles-sidebar.svelte'
	import ArticleSidebar from './article/article-sidebar.svelte'
	import { cn } from '$lib/utils'

	const currentRoute = $derived(page.route.id)
</script>

<StickyBox
	style="view-transition-name: sidebar-articles;"
	class={cn(
		'top-0 z-50 flex h-fit w-[var(--sidebar-width)] shrink flex-col gap-2 px-3 py-2 pt-1 max-lg:hidden'
	)}
>
	{#if currentRoute === '/articles/[...params]' || currentRoute === '/flows/[...params]'}
		<ArticlesSidebar />
	{:else if currentRoute === '/articles/[id=article]'}
		<ArticleSidebar />
	{:else if currentRoute === '/companies/[alias]/articles/[id]'}
		<ArticleSidebar />
	{/if}
</StickyBox>
