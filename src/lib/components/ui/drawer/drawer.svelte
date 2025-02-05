<script lang="ts">
	import type { WithChildren } from 'bits-ui'
	import { Drawer as DrawerPrimitive } from 'vaul-svelte'

	let {
		shouldScaleBackground = true,
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		children,
		...restProps
	}: WithChildren<DrawerPrimitive.Props> = $props()
</script>

<DrawerPrimitive.Root {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps}>
	{@render children?.()}
</DrawerPrimitive.Root>
