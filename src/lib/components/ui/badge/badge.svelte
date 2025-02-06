<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants'

	export const badgeVariants = tv({
		base: 'font-heading focus:ring-ring inline-flex h-[24px] items-center rounded-md px-2 py-0.5 text-sm font-medium transition-colors select-none focus:ring-2 focus:ring-offset-2 focus:outline-none',
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground',
				secondary: 'bg-secondary text-secondary-foreground',
				outline: 'text-foreground border'
			},
			color: {
				white: 'bg-primary text-primary-foreground',
				destructive: 'bg-destructive text-destructive-foreground',
				valid: 'text-background/80 bg-[#64EA58]',
				purple: 'text-background/80 bg-[#64EA58]'
			}
		},
		defaultVariants: {
			variant: 'default',
			color: 'white'
		}
	})

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant']
	export type BadgeColor = VariantProps<typeof badgeVariants>['color']
</script>

<script lang="ts">
	import type { WithElementRef } from 'bits-ui'
	import type { HTMLAnchorAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils.js'

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = 'default',
		color,
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant
		color?: BadgeColor
	} = $props()
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	bind:this={ref}
	{href}
	class={cn(badgeVariants({ variant, color }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
