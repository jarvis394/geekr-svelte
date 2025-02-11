<script lang="ts">
	import { Pagination as PaginationPrimitive } from 'bits-ui'
	import ChevronRight from 'lucide-svelte/icons/chevron-right'
	import { buttonVariants } from '$lib/components/ui/button/index.js'
	import { cn } from '$lib/utils'

	let {
		ref = $bindable(null),
		class: className,
		withLabel,
		children,
		...restProps
	}: PaginationPrimitive.NextButtonProps & {
		withLabel?: boolean
	} = $props()
</script>

{#snippet Fallback()}
	{#if withLabel}<span>Next</span>{/if}
	<ChevronRight class="size-4" />
{/snippet}

<PaginationPrimitive.NextButton
	bind:ref
	class={cn(
		buttonVariants({
			variant: 'ghost',
			class: withLabel ? 'gap-1 pr-2.5' : 'gap-1'
		}),
		className
	)}
	children={children || Fallback}
	{...restProps}
/>
