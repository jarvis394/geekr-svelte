<script lang="ts">
	import type { Article } from '$lib/types'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'
	import { ArticleLabel } from '../article-label'
	import { Badge } from '../ui/badge'

	export type ArticleLabelsProps = {
		article: Article
	} & HTMLAttributes<HTMLDivElement>

	const { article, class: className, ...other }: ArticleLabelsProps = $props()
</script>

<div {...other} class={cn('flex flex-wrap gap-2', className)}>
	<ArticleLabel score={article.statistics.score} />
	{#each article.postLabels as label}
		<ArticleLabel data={label} />
	{/each}
	{#if !article.isCorporative && !article.isEditorial}
		<Badge color="zinc">Авторское</Badge>
	{/if}
</div>
