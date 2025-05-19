<script lang="ts">
	import { Badge } from '../ui/badge'
	import type { BadgeColor } from '../ui/badge/badge.svelte'

	export type ScoreBadgeProps = {
		score: number
		variant?: 'dimmed' | 'colored'
	}

	const { score, variant }: ScoreBadgeProps = $props()
	const formattedScore = $derived.by(() => {
		if (!score) return 0
		return score > 0 ? '+' + score : score.toString()
	})
	const scoreBadgeColor = $derived.by<BadgeColor>(() => {
		const neutral = variant === 'dimmed' ? 'secondary' : 'white'
		const positive = variant === 'dimmed' ? 'scorePositive' : 'valid'
		const negative = variant === 'dimmed' ? 'scoreNegative' : 'destructive'

		if (!score) return neutral
		if (score > 0) return positive
		else if (score < 0) return negative
		else return neutral
	})
</script>

<Badge color={scoreBadgeColor} class="font-semibold">{formattedScore}</Badge>
