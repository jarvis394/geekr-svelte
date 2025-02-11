<script lang="ts">
	import type { WithChildren } from 'bits-ui'
	import { Drawer as DrawerPrimitive } from 'vaul-svelte'

	let {
		shouldScaleBackground = true,
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		children,
		...restProps
	}: WithChildren<DrawerPrimitive.RootProps> = $props()
</script>

<DrawerPrimitive.NestedRoot {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps}>
	{@render children?.()}
</DrawerPrimitive.NestedRoot>
