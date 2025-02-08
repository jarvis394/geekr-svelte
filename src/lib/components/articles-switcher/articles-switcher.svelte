<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import Button, { buttonVariants } from '../ui/button/button.svelte'
	import Settings from 'lucide-svelte/icons/settings'
	import * as Drawer from '$lib/components/ui/drawer'
	import { cn } from '$lib/utils'
	import { makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils/articles'
	import { goto } from '$app/navigation'

	type ModeItem = Partial<GetArticlesParamsData & { label: string }>
	export type ArticlesSwitcherProps = HTMLAttributes<HTMLDivElement> & {
		articleParams: GetArticlesParamsData
	}

	const { class: containerClasses, articleParams, ...other }: ArticlesSwitcherProps = $props()
	const modes: ModeItem[] = [
		{
			label: 'Топ дня',
			mode: 'top',
			period: 'daily'
		},
		{
			label: 'Топ недели',
			mode: 'top',
			period: 'weekly'
		},
		{
			label: 'Новые',
			mode: 'new'
		}
	]

	const isSelected = (mode: ModeItem) => {
		for (const key in mode) {
			const typedKey = key as keyof ModeItem
			if (typedKey === 'label') continue

			const value = mode[typedKey]
			const propsValue = articleParams[typedKey]

			if (value !== propsValue) {
				return false
			}
		}
		return true
	}

	const handleClick = (mode: ModeItem) => {
		if (isSelected(mode)) return
		goto('/articles' + makeArticlesPageUrlFromParams(mode))
	}
</script>

<Drawer.Root>
	<div
		{...other}
		class={cn('flex flex-row items-center gap-1 overflow-x-auto p-2 pt-1', containerClasses)}
	>
		{#each modes as mode}
			<Button
				variant={isSelected(mode) ? 'default' : 'secondary'}
				onclick={handleClick.bind(null, mode)}
				class="rounded-xl text-base font-medium">{mode.label}</Button
			>
		{/each}
		<Drawer.Trigger
			class={buttonVariants({
				variant: 'secondary',
				size: 'icon',
				class: 'rounded-xl p-2 text-base font-medium [&_svg]:size-5'
			})}
		>
			<Settings strokeWidth={2} />
		</Drawer.Trigger>

		<Drawer.Portal>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Are you sure absolutely sure?</Drawer.Title>
					<Drawer.Description>This action cannot be undone.</Drawer.Description>
				</Drawer.Header>
				<Drawer.Footer>
					<Button>Submit</Button>
					<Drawer.Close>Cancel</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Portal>
	</div>
</Drawer.Root>
