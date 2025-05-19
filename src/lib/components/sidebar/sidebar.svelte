<script lang="ts">
	import { page } from '$app/state'
	import type { Component } from 'svelte'
	import StickyBox from '../sticky-box/sticky-box.svelte'
	import ArticlesSidebar from './articles/articles-sidebar.svelte'
	import ArticleSidebar from './article/article-sidebar.svelte'
	import { cn } from '$lib/utils'

	const currentRoute = $derived(page.route.id)
</script>

{#snippet sidebar(SidebarComponent: Component, alias: string, boxClass?: string)}
	<StickyBox
		style={`view-transition-name: sidebar-${alias};`}
		class={cn('top-0 z-50 flex h-fit w-full flex-col gap-2 px-3 py-2', boxClass)}
	>
		<SidebarComponent />
	</StickyBox>
{/snippet}

<div class="w-[var(--sidebar-width)] shrink max-lg:hidden">
	{#if currentRoute === '/articles/[...params]'}
		{@render sidebar(ArticlesSidebar, 'articles', 'pt-1')}
	{:else if currentRoute === '/flows/[...params]'}
		{@render sidebar(ArticlesSidebar, 'articles', 'pt-1')}
	{:else if currentRoute === '/articles/[id=article]'}
		{@render sidebar(ArticleSidebar, 'article')}
	{:else if currentRoute === '/companies/[alias]/articles/[id]'}
		{@render sidebar(ArticleSidebar, 'company-article')}
	{/if}
</div>
