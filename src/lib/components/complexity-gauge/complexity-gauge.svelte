<script lang="ts">
	import type { Article, ArticlesComplexity } from '$lib/types'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'

	export const getComplexityLabel = (value: ComplexityGaugeProps['complexity']) => {
		if (value === 'low' || value === 'easy') {
			return 'Лёгкий'
		} else if (value === 'medium') {
			return 'Средний'
		} else if (value === 'high' || value === 'hard') {
			return 'Сложный'
		}
		return 'Любой'
	}

	export const getComplexityColor = (value: ComplexityGaugeProps['complexity']) => {
		if (value === 'low' || value === 'easy') {
			return 'text-emerald-600 dark:text-emerald-400'
		} else if (value === 'medium') {
			return 'text-blue-600 dark:text-blue-400'
		} else if (value === 'high' || value === 'hard') {
			return 'text-red-600 dark:text-red-400'
		}
		return ''
	}

	export type ComplexityGaugeProps = HTMLAttributes<HTMLSpanElement> & {
		complexity: Article['complexity'] | ArticlesComplexity
		complexityLabel?: string
		complexityColor?: string
	}
	const {
		complexity,
		complexityLabel: propsComplexityLabel,
		complexityColor: propsComplexityColor,
		class: containerClasses,
		...other
	}: ComplexityGaugeProps = $props()
	const complexityLabel = $derived(propsComplexityLabel || getComplexityLabel(complexity))
	const complexityColor = $derived(propsComplexityColor || getComplexityColor(complexity))
	const gaugePointerPath = $derived.by(() => {
		if (complexity === 'low' || complexity === 'easy') {
			return '-4-4'
		} else if (complexity === 'medium') {
			return '0-5'
		} else if (complexity === 'high' || complexity === 'hard') {
			return '4-4'
		}
		return '0-5'
	})
</script>

<span {...other} class={cn('flex items-center transition-all', complexityColor, containerClasses)}>
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
		class={cn('lucide lucide-gauge mr-1 mb-[1px] transition-all', {
			'mr-0 w-0': complexity === 'all'
		})}
	>
		<path class="transition-all" d={`m12 14 ${gaugePointerPath}`} />
		<path d="M3.34 19a10 10 0 1 1 17.32 0" />
	</svg>
	{complexityLabel}
</span>
