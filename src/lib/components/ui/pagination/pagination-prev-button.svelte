<script lang="ts">
	import { Pagination as PaginationPrimitive } from 'bits-ui'
	import ChevronLeft from '@lucide/svelte/icons/chevron-left'
	import { buttonVariants } from '$lib/components/ui/button/index.js'
	import { cn } from '$lib/utils'

	let {
		ref = $bindable(null),
		class: className,
		withLabel,
		children,
		...restProps
	}: PaginationPrimitive.PrevButtonProps & {
		withLabel?: boolean
	} = $props()
</script>

{#snippet Fallback()}
	<ChevronLeft class="size-4" />
	{#if withLabel}<span>Previous</span>{/if}
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	class={cn(
		buttonVariants({
			variant: 'ghost',
			class: withLabel ? 'gap-1 pl-2.5' : 'gap-1'
		}),
		className
	)}
	children={children || Fallback}
	{...restProps}
/>
