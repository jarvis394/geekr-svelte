<script lang="ts">
	import { ArticleItem } from '$lib/components/article-item'
	import { Pagination } from '$lib/components/pagination'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import Logo from '$lib/components/logo/logo.svelte'
	import { goto } from '$app/navigation'
	import { makeArticlesPageUrlFromParams } from '$lib/utils/articles'

	const { data }: PageProps = $props()

	const handlePageChange = (page: number) => {
		goto('/articles' + makeArticlesPageUrlFromParams({ ...data.articleParams, page }))
	}
</script>

<div class="flex h-full w-full flex-col gap-0">
	<div class="flex flex-row items-center px-4 py-2">
		<Logo class="h-[26px]" />
		<div class="grow justify-items-end">
			<img
				class="border-foreground/4 h-8 w-8 rounded-md border"
				src="https://github.com/jarvis394.png"
				alt="Avatar"
			/>
		</div>
	</div>
	{#await data.articles}
		<div class="flex h-full w-full items-center justify-center">
			<LoaderCircle class="animate-spin" />
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
