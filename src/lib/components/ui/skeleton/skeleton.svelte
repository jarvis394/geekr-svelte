<script lang="ts">
	import { cn } from '$lib/utils'
	import type { WithoutChildren, WithElementRef } from 'bits-ui'
	import type { HTMLAttributes } from 'svelte/elements'

	let {
		ref = $bindable(null),
		class: className,
		shimmer,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> & {
		shimmer?: boolean
	} = $props()
</script>

<div
	bind:this={ref}
	data-slot="skeleton"
	class={cn('bg-accent/63 rounded-md', className, {
		shimmer
	})}
	{...restProps}
></div>
