<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query'
	import { ArticleItemPostSmall } from '$lib/components/article-item'
	import { ArticleItemPostSmallSkeleton } from '$lib/components/skeletons'
	import * as api from '$lib/api'
	import { fade } from 'svelte/transition'
	import { fadeAbsolute } from '$lib/utils'

	const query = createQuery(() => ({
		queryKey: ['articles:most-reading'],
		queryFn: async () => await api.articles.getMostReading()
	}))
</script>

<div class="inset-ring-border flex flex-col rounded-2xl pb-2 inset-ring">
	<small class="text-muted-foreground font-heading p-4 pb-2 text-base font-medium">
		Читают сейчас
	</small>

	<div class="relative w-full">
		{#if query.isLoading}
			<div class="w-full" out:fadeAbsolute={{ duration: 200 }}>
				{#each Array(5).fill(null)}
					<ArticleItemPostSmallSkeleton />
				{/each}
			</div>
		{/if}
		{#if query.isSuccess}
			<div in:fade={{ duration: 200 }}>
				{#each query.data.articleIds.slice(0, 5) as id}
					<ArticleItemPostSmall article={query.data.articleRefs[id]} />
				{/each}
			</div>
		{/if}
	</div>
</div>
