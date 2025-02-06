<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'

	export type LinkProps = HTMLAttributes<HTMLAnchorElement>

	const { class: containerClasses, children, ...other }: LinkProps = $props()
</script>

<a {...other} class={cn('text-primary', containerClasses)}>
	{@render children?.()}
</a>
