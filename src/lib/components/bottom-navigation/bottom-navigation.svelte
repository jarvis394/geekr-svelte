<script lang="ts">
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'
	import * as BottomNavigation from '.'
	import { APP_TABS } from '$lib/config/tabs'
	import { page } from '$app/state'

	const homeNavigaion = ['/flows/[...params]', '/articles/[...params]']

	export type BottomNavigationProps = HTMLAttributes<HTMLDivElement>

	const { class: className, children, ...other }: BottomNavigationProps = $props()
	const currentRoute = $derived(page.route.id)
	const currentPathname = $derived(page.url.pathname)
	const active = $derived(
		APP_TABS.find((tab) => {
			if (tab.href === '/') {
				return homeNavigaion.some((e) => e === currentRoute)
			}

			return currentPathname.startsWith(tab.href)
		})
	)
</script>

{#if active}
	<BottomNavigation.Root {...other} class={cn('min-lg:hidden', className)}>
		{#each APP_TABS as tab}
			<BottomNavigation.Item
				active={active.href === tab.href}
				href={tab.href}
				label={tab.label}
				icon={tab.icon}
			/>
		{/each}
	</BottomNavigation.Root>
{/if}
