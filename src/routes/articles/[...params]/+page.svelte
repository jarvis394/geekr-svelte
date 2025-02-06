<script lang="ts">
	import { ArticleItem } from '$lib/components/article-item'
	import { Pagination } from '$lib/components/pagination'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import { goto } from '$app/navigation'
	import { makeArticlesPageUrlFromParams } from '$lib/utils/articles'
	import ArticlesSwitcher from '$lib/components/articles-switcher/articles-switcher.svelte'
	import { AppBar } from '$lib/components/appbar'

	const { data }: PageProps = $props()

	const handlePageChange = (page: number) => {
		goto('/articles' + makeArticlesPageUrlFromParams({ ...data.articleParams, page }))
	}
</script>

<div class="flex w-full flex-col gap-0">
	<AppBar />
	<ArticlesSwitcher />
	{#await data.articles}
		<div class="relative h-[10000px] w-full">
			<div class="sticky top-12 flex w-full items-center justify-center py-16">
				<LoaderCircle class="animate-spin" />
			</div>
		</div>
	{:then articles}
		{#each articles.publicationIds as id}
			<ArticleItem article={articles.publicationRefs[id]} />
		{/each}
		<Pagination
			onPageChange={handlePageChange}
			count={articles.pagesCount}
			page={data.articleParams.page}
		/>
	{/await}
</div>
