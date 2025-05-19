<script lang="ts">
	import { Slider as SliderPrimitive, type WithoutChildrenOrChild } from 'bits-ui'
	import { cn, linearScale } from '$lib/utils'

	const THUMB_SIZE = 16

	let {
		ref = $bindable(null),
		value = $bindable(0),
		orientation = 'horizontal',
		class: className,
		min = 0,
		max = 100,
		...restProps
	}: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props()
	let dragging = $state(false)
	let trackSize = $state<number>()

	const rangeRight = $derived.by(() => {
		if (Array.isArray(value)) return 0
		const percentValue = ((value - min) / max) * 100
		if (!trackSize) return percentValue + '%'

		const percentPadding = (THUMB_SIZE / 2 / trackSize) * 100
		const scale = linearScale([min, max], [percentPadding, 100 - percentPadding])
		const res = scale(value)
		return res + '%'
	})

	const onpointerdown = (e: PointerEvent & { currentTarget: EventTarget & HTMLSpanElement }) => {
		document.body.style.cursor = 'grabbing'
		dragging = true
		restProps.onpointerdown?.(e)
	}

	const onValueCommit = (value: number | number[]) => {
		restProps.onValueCommit?.(value as never)
		document.body.style.removeProperty('cursor')
		dragging = false
	}
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	bind:ref
	bind:value={value as never}
	{orientation}
	class={cn(
		"relative flex touch-none items-center select-none data-[orientation='horizontal']:w-full data-[orientation='vertical']:h-full data-[orientation='vertical']:min-h-44 data-[orientation='vertical']:w-auto data-[orientation='vertical']:flex-col",
		className
	)}
	{min}
	{max}
	{...restProps}
	{onValueCommit}
	{onpointerdown}
>
	{#snippet children({ thumbs, ticks })}
		<span
			bind:clientWidth={trackSize}
			data-orientation={orientation}
			{onpointerdown}
			class={cn(
				"relative grow cursor-pointer overflow-hidden rounded-lg data-[orientation='horizontal']:h-10 data-[orientation='horizontal']:w-full data-[orientation='vertical']:h-full data-[orientation='vertical']:w-2",
				{
					'cursor-grabbing': dragging
				}
			)}
		>
			<SliderPrimitive.Range
				class="bg-primary pointer-events-none absolute z-10 mr-2 rounded-sm transition-all data-[orientation='horizontal']:h-full data-[orientation='vertical']:w-full"
			/>
			<span
				style={`position: absolute; left: ${rangeRight}; right: 0;`}
				class="bg-secondary absolute ml-2 h-full rounded-sm transition-all data-[orientation='horizontal']:h-full data-[orientation='vertical']:w-full"
			></span>
		</span>
		<div
			class="pointer-events-none absolute flex w-full flex-row items-center justify-between px-1.5"
		>
			{#each ticks as index}
				<span
					class={cn('bg-hint/32 z-0 size-0.75 rounded-full transition-all', {
						'opacity-0': index <= Number(value)
					})}
				>
				</span>
			{/each}
		</div>
		{#each thumbs as index (index)}
			<SliderPrimitive.Thumb
				{index}
				data-dragging={dragging}
				style={`width: ${THUMB_SIZE}px;`}
				class={cn(
					'Slider__thumb ring-default after:bg-primary relative z-10 block h-[calc(100%+var(--spacing)*2)] cursor-grab rounded-md ring-offset-4 transition-all after:h-full after:w-1 after:transition-all disabled:pointer-events-none disabled:opacity-50',
					{
						'cursor-grabbing after:w-0.75!': dragging
					}
				)}
			/>
		{/each}
	{/snippet}
</SliderPrimitive.Root>

<style>
	:global(.Slider__thumb::after) {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
		border-radius: 12px;
	}
</style>
