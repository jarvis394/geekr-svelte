<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants'

	export const badgeVariants = tv({
		base: 'font-heading inline-flex h-[24px] items-center rounded-md px-2 py-0.5 text-sm font-medium transition-colors select-none',
		variants: {
			variant: {
				neutral: 'text-primary dark:text-primary-foreground/85 bg-[#E9E9E9]',
				negative: 'bg-destructive text-destructive-foreground',
				positive: 'text-primary/80 dark:text-background/80 bg-[#64EA58]'
			}
		},
		defaultVariants: {
			variant: 'neutral'
		}
	})

	export type ScoreBadgeVariant = VariantProps<typeof badgeVariants>['variant']
</script>

<script lang="ts">
	import type { WithElementRef } from 'bits-ui'
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'

	let {
		ref = $bindable(null),
		class: className,
		variant = 'neutral',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
		variant?: ScoreBadgeVariant
	} = $props()
</script>

<span bind:this={ref} class={cn(badgeVariants({ variant }), className)} {...restProps}>
	{@render children?.()}
</span>
