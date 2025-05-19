<script lang="ts">
	import { onMount } from 'svelte'
	import type { HTMLAttributes } from 'svelte/elements'
	import { Spring } from 'svelte/motion'

	const { children, ...other }: HTMLAttributes<HTMLDivElement> = $props()
	let height = new Spring(0)
	let width = new Spring(0)
	let container = $state<HTMLDivElement>()

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			// We only have one entry, so we can use entries[0]
			const rect = entries[0].contentRect
			height.target = rect.height
			width.target = rect.width
		})

		if (container) {
			resizeObserver.observe(container)
		} else return

		return () => {
			resizeObserver.disconnect()
		}
	})
</script>

<div {...other} style={`width: ${width.current}px; height: ${height.current}px;`}>
	<div class="flex w-fit" bind:this={container}>
		{@render children?.()}
	</div>
</div>
