<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn, makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { FLOWS, FLOWS_MAP } from '$lib/config/flows'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import type { ArticlesFlow } from '$lib/types'
	import ChevronDown from '@lucide/svelte/icons/chevron-down'

	export type AppBarProps = HTMLAttributes<HTMLElement> & {
		spacerProps?: HTMLAttributes<HTMLElement>
	}

	const { class: containerClasses, spacerProps, ...other }: AppBarProps = $props()
	const articleParams = $derived(page.data?.articleParams) as GetArticlesParamsData | undefined
	const selectedFlow = $derived(articleParams?.flow || 'all')

	const handleFlowClick = (flow: ArticlesFlow) => {
		goto(makeArticlesPageUrlFromParams({ ...articleParams, flow }))
	}
</script>

<header
	{...other}
	class={cn(
		'AppBar bg-background/90 max-w-article fixed top-0 z-50 flex min-h-12 w-full flex-row items-center px-1 backdrop-blur-xl',
		containerClasses
	)}
>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="button button-ghost gap-2 px-3.25 py-1.5 pb-1.75 text-lg font-medium"
		>
			{FLOWS_MAP[selectedFlow].title}
			<ChevronDown strokeWidth={2.5} class="text-muted-foreground size-5" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start">
			{#each FLOWS as flow ('flow:' + flow.alias)}
				<DropdownMenu.Item onclick={handleFlowClick.bind(null, flow.alias)}>
					{flow.title}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</header>
<div {...spacerProps} class={cn('h-12 shrink-0', spacerProps?.class)}></div>

<style>
	.AppBar {
		padding-top: var(--insetTop, env(safe-area-inset-top));
	}
</style>
