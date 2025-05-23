<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui'
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
	import { type VariantProps, tv } from 'tailwind-variants'

	export const buttonVariants = tv({
		base: 'button',
		variants: {
			variant: {
				default: 'button-default',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'is-touch:active:bg-accent is-touch:active:inset-ring-transparent bg-background hover:bg-accent/50 hover:text-accent-foreground inset-ring-border inset-ring',
				secondary: 'button-secondary',
				ghost: 'button-ghost',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-xl px-4 text-base',
				icon: 'h-10 w-10 shrink-0'
			},
			align: {
				center: '',
				start: 'justify-start',
				end: 'justify-end'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			align: 'center'
		}
	})

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
	export type ButtonSize = VariantProps<typeof buttonVariants>['size']
	export type ButtonAlign = VariantProps<typeof buttonVariants>['align']

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant
			size?: ButtonSize
			align?: ButtonAlign
		}
</script>

<script lang="ts">
	import { cn } from '$lib/utils'

	let {
		class: className,
		variant = 'default',
		size = 'default',
		align = 'center',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		children,
		...restProps
	}: ButtonProps = $props()
</script>

{#if href}
	<a
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, align }), className)}
		{href}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, align }), className)}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
