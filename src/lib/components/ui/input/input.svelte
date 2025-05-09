<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import type { WithElementRef } from 'bits-ui'
	import { cn } from '$lib/utils'
	import type { Snippet } from 'svelte'

	type Props = WithElementRef<HTMLInputAttributes> & {
		before?: Snippet
		after?: Snippet
	}

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		before,
		after,
		...restProps
	}: Props = $props()
</script>

<label
	class={cn(
		'bg-background border-border focus-ring-within flex h-10 items-center gap-3 self-stretch rounded-xl border px-3 outline-0 transition-all',
		className
	)}
>
	{@render before?.()}
	<input
		bind:this={ref}
		class={cn(
			'input placeholder:text-muted-foreground flex h-full w-full border-0 bg-transparent text-base outline-0 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:select-none disabled:cursor-not-allowed disabled:opacity-50'
		)}
		{type}
		bind:value
		{...restProps}
	/>
	{@render after?.()}
</label>

<style>
	.input[type='search']::-webkit-search-decoration,
	.input[type='search']::-webkit-search-cancel-button,
	.input[type='search']::-webkit-search-results-button,
	.input[type='search']::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}
</style>
