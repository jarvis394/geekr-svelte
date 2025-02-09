<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import { state as scrollTriggerState } from '$lib/hooks/scrollTrigger.svelte'
	import ArrowLeft from 'lucide-svelte/icons/arrow-left'
	import { Button } from '../ui/button'
	import { goto } from '$app/navigation'

	export type HeaderProps = {
		scrollThreshold?: number
		scrollElement?: HTMLElement
		divider?: boolean
		withShrinking?: boolean
		withPositionBar?: boolean
	} & HTMLAttributes<HTMLElement>

	const { class: containerClasses, children, ...other }: HeaderProps = $props()

	const handleBack = () => {
		if (history.length > 1) {
			history.back()
		} else {
			goto('/articles')
		}
	}
</script>

<header
	{...other}
	class={cn(
		'bg-background text-primary font-heading sticky top-0 z-50 flex w-full max-w-xl flex-row items-center gap-1 overflow-hidden px-2 text-xl font-medium',
		containerClasses
	)}
>
	<Button
		onclick={handleBack}
		size="icon"
		class="size-12 rounded-full [&_svg]:size-6"
		variant="ghost"
	>
		<ArrowLeft />
	</Button>
	<p class="mr-4 w-full overflow-hidden text-nowrap text-ellipsis">{@render children?.()}</p>
</header>

<style>
	header {
		view-transition-name: header;
	}
</style>
