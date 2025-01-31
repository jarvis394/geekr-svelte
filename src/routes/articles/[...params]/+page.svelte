<script lang="ts">
	import ArticleItem from '$lib/components/article-item/article-item.svelte'
	import * as Pagination from '$lib/components/ui/pagination'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'

	const { data }: PageProps = $props()
</script>

<div class="flex h-full w-full flex-col gap-0">
	{#await data.articles}
		<div class="flex h-full w-full items-center justify-center">
			<LoaderCircle class="animate-spin" />
		</div>
	{:then articles}
		{#each articles.publicationIds as id}
			<ArticleItem article={articles.publicationRefs[id]} />
		{/each}
		<Pagination.Root class="p-2" count={articles.pagesCount} page={data.articleParams.page}>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content class="w-full justify-between">
					<Pagination.Item>
						<Pagination.PrevButton />
					</Pagination.Item>
					<div class="flex flex-row items-center gap-1">
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
					</div>
					<Pagination.Item>
						<Pagination.NextButton />
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/await}
</div>
