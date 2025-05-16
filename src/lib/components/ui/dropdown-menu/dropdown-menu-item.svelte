<script lang="ts">
	import { cn } from '$lib/utils'
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

	let {
		ref = $bindable(null),
		class: className,
		inset,
		...restProps
	}: DropdownMenuPrimitive.ItemProps & {
		inset?: boolean
	} = $props()
</script>

<DropdownMenuPrimitive.Item
	bind:ref
	class={cn(
		'button-ghost data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-pointer items-center justify-start gap-2 rounded-lg px-2.5 py-1.75 font-sans text-[15px] font-normal transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
		inset && 'pl-8',
		className
	)}
	{...restProps}
/>
