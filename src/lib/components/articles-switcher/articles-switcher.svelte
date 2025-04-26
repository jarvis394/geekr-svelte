<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import Button, { buttonVariants } from '../ui/button/button.svelte'
	import Filter from 'lucide-svelte/icons/filter'
	import * as Drawer from '$lib/components/ui/drawer'
	import { cn } from '$lib/utils'
	import { makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils/articles'
	import { goto } from '$app/navigation'
	import * as Tabs from '../ui/tabs'
	import autoAnimate from '@formkit/auto-animate'
	import {
		type ModeItem,
		ARTICLE_COMPLEXITY,
		TOP_MODES,
		NEW_MODES,
		TABBAR_MODES
	} from '$lib/config/modes'

	export type ArticlesSwitcherProps = HTMLAttributes<HTMLDivElement> & {
		articleParams: GetArticlesParamsData
	}

	const { class: containerClasses, articleParams, ...other }: ArticlesSwitcherProps = $props()

	const excludeKeys = (key: string): key is 'label' | 'tabbarLabel' | 'complexity' | 'smUp' =>
		['label', 'tabbarLabel', 'smUp', 'complexity'].includes(key)
	const isSelected = (mode: ModeItem, selectedMode: Partial<ModeItem> = articleParams) => {
		for (const key in mode) {
			const typedKey = key as keyof ModeItem
			if (excludeKeys(typedKey)) continue

			const value = mode[typedKey]
			const propsValue = selectedMode[typedKey]

			if (value !== propsValue) {
				return false
			}
		}
		return true
	}

	const isSelectedInsideModes = (mode: ModeItem, modes: ModeItem[]) => {
		return modes.some((e) => isSelected(e, mode))
	}

	const getSelectedComplexityFromParams = () => {
		return ARTICLE_COMPLEXITY.find((item) => item.complexity === articleParams.complexity)
	}

	const initialSelectedMode = TOP_MODES.concat(NEW_MODES).find((mode) => isSelected(mode))
	const initialSelectedComplexity = getSelectedComplexityFromParams()
	let selectedMode = $state(initialSelectedMode || TOP_MODES[0])
	let drawerSelectedMode = $state<ModeItem>(initialSelectedMode || TOP_MODES[0])
	let selectedComplexity = $state<ModeItem>(initialSelectedComplexity || ARTICLE_COMPLEXITY[0])
	const shouldShowModeInTabbar = $derived(
		selectedMode && !isSelectedInsideModes(selectedMode, TABBAR_MODES)
	)

	const resetDrawerSelectedMode = () => {
		drawerSelectedMode = selectedMode
		selectedComplexity = getSelectedComplexityFromParams() || selectedComplexity
	}

	const saveModeOnClient = (mode: ModeItem) => {
		// Remove first slash from mode and save it on client
		localStorage.setItem('mode', makeArticlesPageUrlFromParams(mode).replace('/', ''))
	}

	const handleClick = (mode: ModeItem) => {
		if (isSelected(mode)) return
		selectedMode = mode
		drawerSelectedMode = mode
		// Reset selectedComplexity to "all"
		selectedComplexity = ARTICLE_COMPLEXITY[0]
		saveModeOnClient(mode)
		goto('/articles' + makeArticlesPageUrlFromParams(mode))
	}

	const handleDrawerModeClick = (mode: ModeItem) => {
		if (mode.complexity) {
			drawerSelectedMode = { ...drawerSelectedMode, complexity: mode.complexity }
			selectedComplexity = mode
		} else {
			drawerSelectedMode = { ...drawerSelectedMode, ...mode }
		}
	}

	const handleDrawerConfirm = () => {
		if (!drawerSelectedMode) return
		selectedMode = { ...drawerSelectedMode, complexity: selectedComplexity.complexity }
		saveModeOnClient(drawerSelectedMode)
		goto('/articles' + makeArticlesPageUrlFromParams(drawerSelectedMode))
	}
</script>

{#snippet TabContent(value: string, modes: ModeItem[], withAlltimeButtonExpanded?: boolean)}
	<Tabs.Content {value} class="flex flex-col">
		<small class="text-muted-foreground font-heading mb-3 text-base leading-none font-medium">
			Период
		</small>
		<div class="mb-4 grid grid-cols-2 gap-2">
			{#each modes as mode}
				{@const selected = isSelected(mode, drawerSelectedMode)}
				<Button
					variant={selected ? 'default' : 'secondary'}
					size="lg"
					class={cn('grid-cols-1', {
						'col-span-2': withAlltimeButtonExpanded && mode.period === 'alltime'
					})}
					onclick={handleDrawerModeClick.bind(null, mode)}
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
				{@const selected = selectedComplexity.complexity === item.complexity}
				<Button
					variant={selected ? 'default' : 'secondary'}
					size="lg"
					onclick={handleDrawerModeClick.bind(null, item)}
				>
					{item.label}
				</Button>
			{/each}
		</div>
	</Tabs.Content>
{/snippet}

{#snippet TabbarButton(mode: ModeItem)}
	{@const selected = isSelected(mode)}
	<Button
		variant={selected ? 'default' : 'secondary'}
		onclick={handleClick.bind(null, mode)}
		class="rounded-xl text-base font-medium"
	>
		{mode.tabbarLabel}
	</Button>
{/snippet}

<Drawer.Root>
	<div
		{...other}
		class={cn(
			'z-20 flex shrink-0 flex-row items-center gap-1 overflow-x-auto p-2 pt-1',
			containerClasses
		)}
		use:autoAnimate
	>
		{#each TABBAR_MODES as mode}
			{#if mode.mode !== 'new' || !shouldShowModeInTabbar}
				{@render TabbarButton(mode)}
			{/if}
		{/each}
		{#if shouldShowModeInTabbar}
			{@render TabbarButton(selectedMode)}
		{/if}
		<Drawer.Trigger
			onclick={resetDrawerSelectedMode}
			class={buttonVariants({
				variant: 'secondary',
				size: 'icon',
				class: 'rounded-xl p-2 text-base font-medium [&_svg]:size-5'
			})}
		>
			<Filter strokeWidth={2} />
		</Drawer.Trigger>

		<Drawer.Portal>
			<Drawer.Content>
				<Tabs.Root
					value={drawerSelectedMode?.mode || selectedMode?.mode}
					class="flex flex-col gap-2 p-4 pb-0"
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
				<Drawer.Footer>
					<Drawer.Close
						onclick={handleDrawerConfirm}
						class={buttonVariants({
							variant: 'default',
							size: 'lg'
						})}
					>
						Применить
						<md-ripple></md-ripple>
					</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Portal>
	</div>
</Drawer.Root>
