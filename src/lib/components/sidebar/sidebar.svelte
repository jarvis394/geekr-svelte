<script lang="ts">
	import { page } from '$app/state'
	import StickyBox from '../sticky-box/sticky-box.svelte'
	import ArticlesSidebar from './articles/articles-sidebar.svelte'

	const currentRoute = $derived(page.route.id)
</script>

<StickyBox
	offsetBottom={8}
	class="sidebar top-0 z-50 flex h-fit w-[var(--sidebar-width)] shrink flex-col gap-2 px-3 py-1 max-lg:hidden"
>
	{#if currentRoute === '/articles/[...params]'}
		<ArticlesSidebar />
	{:else if currentRoute === '/flows/[...params]'}
		<ArticlesSidebar />
	{:else if currentRoute === '/articles/[id=article]'}
		/articles/[id=article]
	{:else if currentRoute === '/companies/[alias]/articles/[id]'}
		/companies/[alias]/articles/[id]
	{/if}
</StickyBox>
