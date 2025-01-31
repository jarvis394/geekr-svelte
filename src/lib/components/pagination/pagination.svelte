<script lang="ts">
	import { Pagination as PaginationPrimitive } from 'bits-ui'
	import * as Pagination from '../ui/pagination'

	const props: PaginationPrimitive.RootProps = $props()
</script>

<Pagination.Root class="p-2" {...props}>
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
