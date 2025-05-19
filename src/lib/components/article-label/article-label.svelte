<script lang="ts">
	import type { ArticleLabel } from '$lib/types'
	import { Badge } from '../ui/badge'
	import type { BadgeColor } from '../ui/badge/badge.svelte'

	export type ArticleLabelProps =
		| {
				data: ArticleLabel
				score?: never
				variant?: never
		  }
		| {
				data?: never
				score: number
				variant?: 'dimmed' | 'colored'
		  }

	const { data, score, variant }: ArticleLabelProps = $props()
	const formattedScore = $derived.by(() => {
		if (!score) return 0
		return score > 0 ? '+' + score : score.toString()
	})
	const scoreBadgeColor = $derived.by<BadgeColor>(() => {
		if (!score) return 'white'
		if (score > 0) return variant === 'dimmed' ? 'scorePositive' : 'valid'
		else if (score < 0) return variant === 'dimmed' ? 'scoreNegative' : 'destructive'
		else return 'white'
	})
</script>

{#if score !== undefined}
	<Badge color={scoreBadgeColor} class="font-semibold">{formattedScore}</Badge>
{:else if data.type === 'sandbox'}
	<Badge color="lightgray">{data.title}</Badge>
{:else if data.type === 'translation'}
	<Badge color="sky">{data.title}</Badge>
{:else if data.type === 'tutorial'}
	<Badge color="indigo">{data.title}</Badge>
{:else if data.type === 'recovery'}
	<Badge color="orange">{data.title}</Badge>
{:else if data.type.startsWith('technotext')}
	<Badge color="indigo">{data.title}</Badge>
{:else}
	<Badge color="lightgray">{data.title}</Badge>
{/if}
