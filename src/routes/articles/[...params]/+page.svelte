<script lang="ts">
	import { ArticleItem } from '$lib/components/article-item'
	import { Pagination } from '$lib/components/pagination'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte'

	const { data }: PageProps = $props()
</script>

<div class="flex h-full w-full flex-col gap-0">
	{#await data.articles}
		<div class="flex h-full w-full items-center justify-center">
			<LoaderCircle class="animate-spin" />
		</div>
	{:then articles}
		<ScrollArea>
			{#each articles.publicationIds as id}
				<ArticleItem article={articles.publicationRefs[id]} />
			{/each}
			<Pagination count={articles.pagesCount} page={data.articleParams.page} />
		</ScrollArea>
	{/await}
</div>
