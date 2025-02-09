<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'

	export type LinkProps = HTMLAttributes<HTMLAnchorElement> & {
		href?: string
	}

	const { class: containerClasses, children, ...other }: LinkProps = $props()
</script>

<a {...other} class={cn('link', containerClasses)}>
	{@render children?.()}
</a>
