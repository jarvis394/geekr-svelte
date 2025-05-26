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
		withLabel?: boolean
		filled?: boolean
	}
	const {
		complexity,
		complexityLabel: propsComplexityLabel,
		complexityColor: propsComplexityColor,
		withLabel = false,
		filled = false,
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

<span
	{...other}
	class={cn(
		'flex items-center gap-1 transition-all',
		{
			'gap-0': complexity === 'all'
		},
		complexityColor,
		containerClasses
	)}
>
	{#if filled}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 -960 960 960"
			fill="currentColor"
			class={cn('lucide lucide-gauge transition-all', {
				'w-0': complexity === 'all'
			})}
		>
			<path
				d="M418-340q25 25 63 23.5t55-27.5l224-336-336 224q-26 18-28.5 54.5T418-340ZM204-160q-22 0-40.5-9.5T134-198q-26-47-40-97.5T80-400q0-83 31.5-156T197-683q54-54 127-85.5T480-800q82 0 154 31t126 84.5q54 53.5 86 125T879-406q1 55-12.5 107.5T825-198q-11 19-29.5 28.5T755-160H204Z"
			/>
		</svg>
	{:else}
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
			class={cn('lucide lucide-gauge mb-[1px] transition-all', {
				'w-0': complexity === 'all'
			})}
		>
			<path class="transition-all" d={`m12 14 ${gaugePointerPath}`} />
			<path d="M3.34 19a10 10 0 1 1 17.32 0" />
		</svg>
	{/if}

	{#if withLabel}{complexityLabel}{/if}
</span>
