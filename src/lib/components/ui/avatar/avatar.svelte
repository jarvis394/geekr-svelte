<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils'

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.RootProps = $props()
</script>

<AvatarPrimitive.Root
	bind:ref
	class={cn('bg-muted relative flex size-10 shrink-0 overflow-hidden rounded-sm', className)}
	{...restProps}
/>
