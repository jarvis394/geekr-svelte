<script lang="ts">
	import { Drawer as DrawerPrimitive } from 'vaul-svelte'
	import { cn } from '$lib/utils'

	let { class: className, children, ...restProps }: DrawerPrimitive.TitleProps = $props()
</script>

<DrawerPrimitive.Title
	class={cn('text-lg leading-none font-semibold tracking-tight', className)}
	{...restProps}
>
	{@render children?.()}
</DrawerPrimitive.Title>
