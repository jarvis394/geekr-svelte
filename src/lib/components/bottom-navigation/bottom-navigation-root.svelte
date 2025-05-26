<script lang="ts" module>
	export const BOTTOM_NAVIGATION_HEIGHT = 52
</script>

<script lang="ts">
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'

	export type BottomNavigationRootProps = HTMLAttributes<HTMLDivElement>

	const { class: className, style, children, ...other }: BottomNavigationRootProps = $props()
</script>

<div
	{...other}
	class={cn(
		'bg-background/90 fixed right-0 bottom-0 left-0 z-100 flex w-[calc(100%-var(--scrollbar-width))] flex-row items-center justify-center backdrop-blur-xl',
		className
	)}
	style={`height: ${BOTTOM_NAVIGATION_HEIGHT}px;` + style}
>
	{@render children?.()}
</div>
