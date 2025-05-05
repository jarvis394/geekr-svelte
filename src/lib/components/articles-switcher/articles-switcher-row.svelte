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
	import {
		getSelectedComplexityFromParams,
		getSelectedModeFromParams,
		isSelected,
		isSelectedInsideModes,
		saveModeOnClient
	} from './utils'
	import ArticlesSwitcher from './articles-switcher.svelte'

	export type ArticlesSwitcherProps = HTMLAttributes<HTMLDivElement> & {
		articleParams: GetArticlesParamsData
	}

	const { class: containerClasses, articleParams, ...other }: ArticlesSwitcherProps = $props()

	let selectedMode = $derived(getSelectedModeFromParams(articleParams))
	let drawerSelectedMode = $derived(selectedMode)
	const shouldShowModeInTabbar = $derived(
		selectedMode && !isSelectedInsideModes(selectedMode, TABBAR_MODES)
	)

	const resetDrawerSelectedMode = () => {
		drawerSelectedMode = selectedMode
	}

	const handleClick = (mode: ModeItem) => {
		if (isSelected(mode, articleParams)) return
		// Reset selectedComplexity to "all" as well
		drawerSelectedMode = { ...mode, complexity: ARTICLE_COMPLEXITY[0].complexity }
		saveModeOnClient(mode)
		goto('/articles' + makeArticlesPageUrlFromParams(mode))
	}

	const handleDrawerConfirm = () => {
		if (!drawerSelectedMode) return
		selectedMode = drawerSelectedMode
		saveModeOnClient(drawerSelectedMode)
		goto('/articles' + makeArticlesPageUrlFromParams(drawerSelectedMode))
	}

	$effect(() => {
		saveModeOnClient(selectedMode)
	})
</script>

{#snippet TabbarButton(mode: ModeItem)}
	{@const selected = isSelected(mode, articleParams)}
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
				<ArticlesSwitcher {articleParams} bind:selectedMode={drawerSelectedMode} />
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
