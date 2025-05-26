<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import Button, { buttonVariants } from '../ui/button/button.svelte'
	import Filter from '@lucide/svelte/icons/filter'
	import * as Drawer from '$lib/components/ui/drawer'
	import { cn } from '$lib/utils'
	import { makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils/articles'
	import { goto } from '$app/navigation'
	import autoAnimate from '@formkit/auto-animate'
	import { type ModeItem, ARTICLE_COMPLEXITY, TABBAR_MODES } from '$lib/config/modes'
	import {
		getSelectedModeFromParams,
		isSelected,
		isSelectedInsideModes,
		saveModeOnClient
	} from './utils'
	import ArticlesSwitcher from './articles-switcher.svelte'
	import { FLOWS_MAP } from '$lib/config/flows'
	import { ComplexityGauge } from '../complexity-gauge'

	export type ArticlesSwitcherProps = HTMLAttributes<HTMLDivElement> & {
		articlesParams: GetArticlesParamsData
		articlesMode: 'articles' | 'news' | 'posts'
	}

	const {
		class: containerClasses,
		articlesMode,
		articlesParams,
		...other
	}: ArticlesSwitcherProps = $props()

	let open = $state(false)
	let selectedMode = $derived(getSelectedModeFromParams(articlesParams))
	let drawerSelectedMode = $derived(selectedMode)
	const selectedFlow = $derived(articlesParams?.flow || 'all')
	const shouldShowModeInTabbar = $derived(
		selectedMode && !isSelectedInsideModes(selectedMode, TABBAR_MODES)
	)

	const resetDrawerSelectedMode = () => {
		drawerSelectedMode = selectedMode
	}

	const handleOpenChange = (newValue: boolean) => {
		open = newValue
	}

	const handleClick = (mode: ModeItem) => {
		if (isSelected(mode, articlesParams, true)) return
		mode = {
			...mode, // Do not reset articles flow that user selected
			flow: articlesParams.flow,
			// Reset selectedComplexity to "all" as well
			complexity: ARTICLE_COMPLEXITY[0].complexity
		}
		drawerSelectedMode = mode
		saveModeOnClient(mode, articlesMode)
		goto(makeArticlesPageUrlFromParams(mode, articlesMode))
	}

	const handleDrawerConfirm = () => {
		if (!drawerSelectedMode) return
		selectedMode = drawerSelectedMode
		saveModeOnClient(drawerSelectedMode, articlesMode)
		goto(makeArticlesPageUrlFromParams(drawerSelectedMode, articlesMode))
	}

	$effect(() => {
		saveModeOnClient(selectedMode, articlesMode)
	})
</script>

{#snippet TabbarButton(mode: ModeItem)}
	{@const selected = isSelected(mode, articlesParams, true)}
	<Button
		variant={selected ? 'default' : 'secondary'}
		onclick={handleClick.bind(null, mode)}
		class="gap-1 rounded-xl text-base font-medium [&_svg]:size-5"
	>
		{#if mode.complexity}
			<ComplexityGauge filled complexity={mode.complexity} />
		{/if}
		{mode.tabbarLabel}
	</Button>
{/snippet}

<Drawer.Root {open} onOpenChange={handleOpenChange}>
	{#if selectedFlow !== 'all'}
		<Button
			onclick={handleOpenChange.bind(null, true)}
			variant="secondary"
			class={cn(
				'font-heading bg-accent text-muted-foreground mb-1 flex h-9 scale-100 items-center justify-center rounded-none px-4 py-0 text-base font-medium select-none',
				containerClasses
			)}
		>
			Выбранный хаб — {FLOWS_MAP[selectedFlow].title}
			<md-ripple></md-ripple>
		</Button>
	{/if}
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
	</div>

	<Drawer.Portal>
		<Drawer.Content>
			<ArticlesSwitcher
				onClose={handleOpenChange.bind(null, false)}
				{articlesParams}
				{articlesMode}
				bind:selectedMode={drawerSelectedMode}
			/>
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
</Drawer.Root>
