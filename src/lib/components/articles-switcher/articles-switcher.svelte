<script lang="ts">
	import Button, { type ButtonVariant } from '../ui/button/button.svelte'
	import { cn } from '$lib/utils'
	import { makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils/articles'
	import { goto } from '$app/navigation'
	import * as Tabs from '../ui/tabs'
	import { type ModeItem, ARTICLE_COMPLEXITY, TOP_MODES, NEW_MODES } from '$lib/config/modes'
	import { getSelectedModeFromParams, isSelected, saveModeOnClient } from './utils'
	import type { TabsRootProps } from 'bits-ui'

	export type ArticlesSwitcherProps = TabsRootProps & {
		articleParams: GetArticlesParamsData
		applyOnClick?: boolean
		variant?: 'default' | 'desktop'
		selectedMode?: ModeItem
	}

	let {
		class: containerClasses,
		articleParams,
		applyOnClick,
		selectedMode = $bindable(getSelectedModeFromParams(articleParams)),
		variant = 'default',
		...other
	}: ArticlesSwitcherProps = $props()

	const getButtonVariant = $derived<(selected: boolean) => ButtonVariant>((selected) => {
		if (selected) return variant === 'desktop' ? 'secondary' : 'default'
		return variant === 'desktop' ? 'outline' : 'secondary'
	})

	const handleModeClick = (mode: ModeItem) => {
		selectedMode = mode

		if (mode.complexity) {
			selectedMode.complexity = mode.complexity
		}

		if (applyOnClick) {
			saveModeOnClient(selectedMode)
			goto('/articles' + makeArticlesPageUrlFromParams(selectedMode))
		}
	}

	$effect(() => {
		selectedMode = getSelectedModeFromParams(articleParams)
	})
</script>

{#snippet TabContent(value: string, modes: ModeItem[], withAlltimeButtonExpanded?: boolean)}
	<Tabs.Content {value} class="flex flex-col">
		<small class="text-muted-foreground font-heading mb-3 text-base leading-none font-medium">
			Период
		</small>
		<div
			class={cn('mb-4 gap-2', {
				'flex flex-wrap': variant === 'desktop',
				'grid grid-cols-2': variant === 'default'
			})}
		>
			{#each modes as mode}
				{@const selected = isSelected(mode, selectedMode)}
				<Button
					size="lg"
					variant={getButtonVariant(selected)}
					onclick={handleModeClick.bind(null, mode)}
					class={cn({
						'w-fit': variant === 'desktop',
						'grid-cols-1': variant === 'default',
						'col-span-2':
							withAlltimeButtonExpanded && mode.period === 'alltime' && variant === 'default'
					})}
				>
					{mode.label}
				</Button>
			{/each}
		</div>
		<small class="text-muted-foreground font-heading mb-3 text-base leading-none font-medium">
			Сложность
		</small>
		<div class="xs:grid-cols-4 grid grid-cols-2 gap-2">
			{#each ARTICLE_COMPLEXITY as item}
				{@const selected = selectedMode.complexity === item.complexity}
				<Button
					size="lg"
					variant={getButtonVariant(selected)}
					onclick={handleModeClick.bind(null, item)}
				>
					{item.label}
				</Button>
			{/each}
		</div>
	</Tabs.Content>
{/snippet}

<Tabs.Root
	{...other}
	value={selectedMode?.mode}
	class={cn('flex flex-col gap-2 p-4 pb-0', containerClasses)}
>
	<div class="flex flex-col gap-3">
		<small class="text-muted-foreground font-heading text-base leading-none font-medium">
			Сначала показывать
		</small>
		<Tabs.List>
			<Tabs.Trigger value="top">Лучшие</Tabs.Trigger>
			<Tabs.Trigger value="new">Новые</Tabs.Trigger>
		</Tabs.List>
	</div>
	{@render TabContent('top', TOP_MODES, true)}
	{@render TabContent('new', NEW_MODES)}
</Tabs.Root>
