<script lang="ts">
	import { Drawer as DrawerPrimitive } from 'vaul-svelte'
	import DrawerOverlay from './drawer-overlay.svelte'
	import { cn } from '$lib/utils'
	import type { DialogPortalProps } from 'bits-ui'

	let {
		class: className,
		portalProps,
		children,
		...restProps
	}: DrawerPrimitive.ContentProps & {
		portalProps?: DialogPortalProps
	} = $props()
</script>

<DrawerPrimitive.Portal {...portalProps}>
	<DrawerOverlay />
	<DrawerPrimitive.Content
		class={cn(
			'bg-background fixed inset-x-0 bottom-0 z-50 mx-auto mt-24 flex h-auto max-w-xl flex-col rounded-t-xl border',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</DrawerPrimitive.Content>
</DrawerPrimitive.Portal>

<style>
	:global([data-vaul-drawer]:not([data-vaul-custom-container='true'])::after) {
		border-left: 1px solid hsl(var(--border) / 1);
		border-right: 1px solid hsl(var(--border) / 1);
		right: -1px !important;
		left: -1px !important;
		width: calc(100% + 2px);
	}
</style>
