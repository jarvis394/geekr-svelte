<script lang="ts">
	import { page } from '$app/state'
	import StickyBox from '../sticky-box/sticky-box.svelte'
	import { cn } from '$lib/utils'
	import { MediaQuery } from 'svelte/reactivity'
	import ArticlesSidebar from './articles/index.svelte'
	import ArticleSidebar from './article/index.svelte'
	import ArticleCommentsSidebar from './article-comments/index.svelte'

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
	const articleCommentsPages = new Set([
		'/articles/[id=article]/comments',
		'/companies/[alias]/articles/[id]/comments',
		'/news/[id=article]/comments',
		'/posts/[id=article]/comments'
	])
	const currentRoute = $derived(page.route.id || '')
	const isDesktopMode = new MediaQuery('min-width: 1024px', true)
</script>

<div class="relative z-50 w-[var(--sidebar-width)] max-lg:hidden">
	{#if isDesktopMode.current}
		<StickyBox
			style="view-transition-name: sidebar-articles; will-change: position, top;"
			class={cn('top-0 h-fit w-[var(--sidebar-width)] shrink transform-gpu px-3 py-2 pt-1')}
		>
			{#if articlesPages.has(currentRoute)}
				<ArticlesSidebar />
			{:else if articlePages.has(currentRoute)}
				<ArticleSidebar />
			{:else if articleCommentsPages.has(currentRoute)}
				<ArticleCommentsSidebar />
			{/if}
		</StickyBox>
	{/if}
</div>
