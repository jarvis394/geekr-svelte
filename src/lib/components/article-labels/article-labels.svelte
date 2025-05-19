<script lang="ts">
	import type { Article } from '$lib/types'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'
	import { ArticleLabel } from '../article-label'
	import { Badge } from '../ui/badge'
	import { ScoreBadge, type ScoreBadgeProps } from '../score-badge'

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
</script>

<div {...other} class={cn('flex flex-wrap gap-2', className)}>
	<ScoreBadge variant={scoreVariant} score={article.statistics.score} />
	{#each article.postLabels as label}
		<ArticleLabel data={label} />
	{/each}
	{#if !article.isCorporative && !article.isEditorial}
		<Badge color="zinc">Авторское</Badge>
	{/if}
</div>
