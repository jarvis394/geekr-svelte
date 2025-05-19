<script lang="ts">
	import Button, { type ButtonVariant } from '../ui/button/button.svelte'
	import { cn } from '$lib/utils'
	import { makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils/articles'
	import { goto } from '$app/navigation'
	import * as Tabs from '../ui/tabs'
	import { type ModeItem, ARTICLE_COMPLEXITY, TOP_MODES, NEW_MODES } from '$lib/config/modes'
	import { getSelectedModeFromParams, isSelected, saveModeOnClient } from './utils'
	import type { TabsRootProps } from 'bits-ui'
	import { FLOWS } from '$lib/config/flows'
	import type { ArticlesFlow } from '$lib/types'

	export type ArticlesSwitcherProps = TabsRootProps & {
		articleParams: GetArticlesParamsData
		applyOnClick?: boolean
		variant?: 'default' | 'desktop'
		selectedMode?: ModeItem
		onClose?: () => void
	}

	let {
		class: containerClasses,
		articleParams,
		applyOnClick,
		selectedMode = $bindable(getSelectedModeFromParams(articleParams)),
		variant = 'default',
		onClose,
		...other
	}: ArticlesSwitcherProps = $props()
	const selectedFlow = $derived(articleParams?.flow || 'all')

	const getButtonVariant = $derived<(selected: boolean) => ButtonVariant>((selected) => {
		if (selected) return 'default'
		return variant === 'desktop' ? 'outline' : 'secondary'
	})

	const handleModeClick = (mode: ModeItem) => {
		selectedMode = { ...selectedMode, ...mode }

		if (mode.complexity) {
			selectedMode.complexity = mode.complexity
		}

		if (applyOnClick) {
			onClose?.()
			saveModeOnClient(selectedMode)
			goto(makeArticlesPageUrlFromParams(selectedMode))
		}
	}

	const handleFlowClick = (flow: ArticlesFlow) => {
		onClose?.()
		goto(makeArticlesPageUrlFromParams({ ...articleParams, flow }))
	}

	$effect(() => {
		selectedMode = getSelectedModeFromParams(articleParams)
	})
</script>

{#snippet TabContent(value: string, modes: ModeItem[], withAlltimeButtonExpanded?: boolean)}
	<Tabs.Content {value} class="mt-1 flex flex-col">
		<small class="text-muted-foreground font-heading mb-2 text-base font-medium"> Период </small>
		<div
			class={cn('mb-3 gap-2', {
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
		<small class="text-muted-foreground font-heading mb-2 text-base font-medium"> Сложность </small>
		<div
			class={cn('grid grid-cols-2 gap-2', {
				'grid-cols-2': variant === 'desktop',
				'xs:grid-cols-4': variant === 'default'
			})}
		>
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

{#if variant === 'default'}
	<div class="bg-accent/50 relative flex flex-col gap-1 overflow-auto rounded-lg">
		<h3
			class="text-small font-heading text-muted-foreground/63 sticky left-0 pt-4 pl-4 font-medium"
		>
			Поток
		</h3>
		<div class="flex flex-row gap-0 px-2 pb-2">
			{#each FLOWS as flow}
				<Button
					size="lg"
					variant="ghost"
					onclick={handleFlowClick.bind(null, flow.alias)}
					class={cn('rounded-md px-2', {
						'text-primary': selectedFlow === flow.alias,
						'text-muted-foreground': selectedFlow !== flow.alias
					})}
				>
					{flow.title}
				</Button>
			{/each}
		</div>
	</div>
{/if}
<Tabs.Root
	{...other}
	value={selectedMode?.mode}
	class={cn('flex flex-col gap-2 p-4 pb-0', containerClasses)}
>
	<div class="flex flex-col gap-2">
		<small class="text-muted-foreground font-heading text-base font-medium">
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
