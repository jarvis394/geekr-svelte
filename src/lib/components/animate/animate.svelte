<script lang="ts">
	import { cn } from '$lib/utils'
	import type { WithoutChildren } from 'bits-ui'
	import type { HTMLAttributes } from 'svelte/elements'
	import { Spring } from 'svelte/motion'

	type AnimateProps = {
		/** When container's new height is 0, preserve last height value*/
		preserveHeight?: boolean
		/** When container's new width is 0, preserve last width value*/
		preserveWidth?: boolean
		enabled?: boolean
		containerProps?: WithoutChildren<HTMLAttributes<HTMLDivElement>>
	}
	const {
		children,
		preserveHeight,
		preserveWidth,
		containerProps,
		enabled = true,
		...other
	}: AnimateProps & HTMLAttributes<HTMLDivElement> = $props()
	let height = new Spring(0)
	let width = new Spring(0)
	let container = $state<HTMLDivElement>()
	let hydrated = $state(false)

	$effect(() => {
		hydrated = true

		if (!enabled) return

		const resizeObserver = new ResizeObserver((entries) => {
			// We only have one entry, so we can use entries[0]
			const rect = entries[0].contentRect

			if (preserveHeight && rect.height === 0) {
				width.target = rect.width
				return
			}

			if (preserveWidth && rect.width === 0) {
				height.target = rect.height
				return
			}

			height.target = rect.height
			width.target = rect.width
		})

		if (container) {
			resizeObserver.observe(container)
			width.set(container.clientWidth, {
				instant: true
			})
			height.set(container.clientHeight, {
				instant: true
			})
		} else return

		return () => {
			resizeObserver.disconnect()
		}
	})
</script>

<div
	{...other}
	style={`height: ${hydrated ? height.current + 'px' : 'auto'}; width: ${hydrated ? width.current + 'px' : 'auto'};`}
>
	<div {...containerProps} class={cn('flex w-fit', containerProps?.class)} bind:this={container}>
		{@render children?.()}
	</div>
</div>
