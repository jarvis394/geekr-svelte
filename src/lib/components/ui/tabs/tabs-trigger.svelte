<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils'

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsPrimitive.TriggerProps = $props()
</script>

<TabsPrimitive.Trigger
	bind:ref
	class={cn(
		'ring-offset-background font-heading focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex grow cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-base font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm',
		className
	)}
	{...restProps}
/>
