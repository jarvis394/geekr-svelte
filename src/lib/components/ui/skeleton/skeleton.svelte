<script lang="ts">
	import { cn } from '$lib/utils'
	import type { WithoutChildren, WithElementRef } from 'bits-ui'
	import type { HTMLAttributes } from 'svelte/elements'

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props()
</script>

<div
	bind:this={ref}
	data-slot="skeleton"
	class={cn('bg-accent shimmer rounded-md', className)}
	{...restProps}
></div>
