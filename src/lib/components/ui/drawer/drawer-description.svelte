<script lang="ts">
	import { Drawer as DrawerPrimitive } from 'vaul-svelte'
	import { cn } from '$lib/utils.js'

	let { class: className, children, ...restProps }: DrawerPrimitive.DescriptionProps = $props()
</script>

<DrawerPrimitive.Description class={cn('text-muted-foreground text-sm', className)} {...restProps}>
	{@render children?.()}
</DrawerPrimitive.Description>
