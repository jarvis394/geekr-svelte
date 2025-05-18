<script lang="ts">
	import type { Article } from '$lib/types'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'

	type ComplexityGaugeProps = HTMLAttributes<HTMLSpanElement> & {
		complexity: Article['complexity']
	}
	const { complexity, class: containerClasses, ...other }: ComplexityGaugeProps = $props()

	const complexityLabel = $derived.by(() => {
		if (complexity === 'low') {
			return 'Лёгкий'
		} else if (complexity === 'medium') {
			return 'Средний'
		} else if (complexity === 'high') {
			return 'Сложный'
		}
		return ''
	})
	const complexityColor = $derived.by(() => {
		if (complexity === 'low') {
			return 'text-emerald-600 dark:text-emerald-400'
		} else if (complexity === 'medium') {
			return 'text-blue-600 dark:text-blue-400'
		} else if (complexity === 'high') {
			return 'text-red-600 dark:text-red-400'
		}
		return ''
	})
	const gaugePointerPath = $derived.by(() => {
		if (complexity === 'low') {
			return '-4-4'
		} else if (complexity === 'medium') {
			return '0-5'
		} else if (complexity === 'high') {
			return '4-4'
		}
		return '0-5'
	})
</script>

<span {...other} class={cn('flex items-center gap-1', complexityColor, containerClasses)}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-gauge mb-[1px]"
	>
		<path d={`m12 14 ${gaugePointerPath}`} />
		<path d="M3.34 19a10 10 0 1 1 17.32 0" />
	</svg>
	{complexityLabel}
</span>
