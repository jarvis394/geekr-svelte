<script lang="ts">
	import { type Avatar as AvatarPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils'

	let {
		ref = $bindable(null),
		class: className,
		hash,
		src,
		loaded = $bindable(false),
		...restProps
	}: AvatarPrimitive.ImageProps & {
		hash?: string
		loaded?: boolean
	} = $props()

	const placeholderAvatarUrl = $derived.by(() => {
		if (src) return null

		let n = 0
		hash?.split('').forEach((e) => (n += e.charCodeAt(0)))
		const index = (n % 100) + 101
		return `https://assets.habr.com/habr-web/img/avatars/${index}.png`
	})

	const handleLoad = () => {
		loaded = true
	}
</script>

<div
	class={cn(
		'bg-muted relative flex aspect-square size-10 shrink-0 overflow-hidden rounded-sm',
		className
	)}
>
	<img
		bind:this={ref}
		src={src || placeholderAvatarUrl}
		onload={handleLoad}
		data-loaded={loaded}
		class={cn(
			'no-drag flex aspect-square h-full w-full shrink-0 opacity-0 transition-all duration-200 data-[loaded="true"]:opacity-100'
		)}
		{...restProps}
	/>
</div>
