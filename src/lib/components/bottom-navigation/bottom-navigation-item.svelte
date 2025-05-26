<script lang="ts">
	import { page } from '$app/state'
	import { cn } from '$lib/utils'
	import type { Component } from 'svelte'
	import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements'

	export type BottomNavigationItemProps = {
		icon: Component
		label: string
		href: string
		active?: boolean
	} & Omit<HTMLAttributes<HTMLAnchorElement>, 'children'>

	const {
		class: className,
		href,
		label,
		icon: Icon,
		active,
		onclick,
		...other
	}: BottomNavigationItemProps = $props()

	const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		if (active) {
			e.preventDefault()
		}

		onclick?.(e)
	}
</script>

<a
	{...other}
	{href}
	onclick={handleClick}
	class={cn(
		'font-heading text-muted-foreground relative isolate flex h-full grow cursor-pointer flex-col items-center justify-center gap-0.75 pt-0.5 text-xs font-medium transition-all select-none',
		className,
		{
			'text-primary': active
		}
	)}
>
	<span class="flex items-center justify-center rounded-2xl [&_svg]:size-6">
		<Icon />
	</span>
	{label}
	<md-ripple></md-ripple>
</a>
