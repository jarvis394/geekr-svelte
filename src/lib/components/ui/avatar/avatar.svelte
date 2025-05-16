<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils'

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: AvatarPrimitive.RootProps = $props()
</script>

<div
	bind:this={ref}
	class={cn('bg-muted relative flex size-10 shrink-0 overflow-hidden rounded-sm', className)}
	{...restProps}
>
	{@render children?.()}
</div>
