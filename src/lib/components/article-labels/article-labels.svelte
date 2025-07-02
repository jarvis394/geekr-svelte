<script lang="ts">
	import type { Article } from '$lib/types'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'
	import { ArticleLabel } from '../article-label'
	import { Badge } from '../ui/badge'
	import { ScoreBadge, type ScoreBadgeProps } from '../score-badge'
	import { ArticleFormatLabel } from '../article-format-label'

	export type ArticleLabelsProps = {
		article: Article
		scoreVariant?: ScoreBadgeProps['variant']
	} & HTMLAttributes<HTMLDivElement>

	const {
		article,
		scoreVariant = 'dimmed',
		class: className,
		...other
	}: ArticleLabelsProps = $props()
	const labels = $derived.by(() => {
		return article.postLabels?.sort((a, b) => a.title.length - b.title.length)
	})
</script>

<div {...other} class={cn('flex flex-wrap gap-2', className)}>
	<ScoreBadge variant={scoreVariant} score={article.statistics.score} />
	{#if article.format && article.format !== 'common'}
		<ArticleFormatLabel data={article.format} />
	{/if}
	{#if !article.isCorporative && !article.isEditorial}
		<Badge color="zinc">Авторское</Badge>
	{/if}
	{#each labels as label}
		<ArticleLabel data={label} />
	{/each}
</div>
