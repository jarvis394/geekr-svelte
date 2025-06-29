<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants'

	export const badgeVariants = tv({
		base: 'font-heading focus:ring-ring inline-flex h-[24px] items-center rounded-md px-2 py-0.5 text-sm font-medium transition-colors select-none focus:ring-2 focus:ring-offset-2 focus:outline-none',
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground',
				outline: 'text-foreground border'
			},
			color: {
				secondary: 'bg-secondary text-secondary-foreground',
				white: 'bg-primary text-primary-foreground',
				lightgray: 'text-primary dark:text-primary-foreground/85 bg-[#E9E9E9]',
				sky: 'bg-sky-600 text-sky-50 dark:bg-sky-700',
				rose: 'bg-rose-800 text-rose-50',
				fuchsia: 'bg-fuchsia-800 text-fuchsia-50',
				emerald: 'bg-emerald-800 text-emerald-50',
				zinc: 'bg-zinc-800 text-zinc-50',
				indigo: 'bg-indigo-500 text-indigo-50',
				orange: 'bg-orange-500 text-orange-50',
				destructive: 'bg-destructive text-destructive-foreground',
				valid: 'text-primary/80 dark:text-background/80 bg-[#64EA58]',
				scorePositive: 'text-primary bg-[#64EA58] dark:bg-[#002210] dark:text-[#0CFF7B]',
				scoreNegative: 'bg-destructive text-destructive-foreground',
				darkGreen: 'bg-emerald-950 text-emerald-100',
				darkBlue: 'bg-blue-950 text-blue-100',
				darkRed: 'bg-red-950 text-red-100',
				darkOrange: 'bg-orange-800 text-orange-50'
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
	import { cn } from '$lib/utils'

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
