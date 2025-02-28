<script lang="ts">
	import { type Avatar as AvatarPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils'

	let {
		ref = $bindable(null),
		class: className,
		hash,
		src,
		...restProps
	}: AvatarPrimitive.ImageProps & {
		hash?: string
	} = $props()
	const placeholderAvatarUrl = $derived.by(() => {
		if (src) return null

		let n = 0
		hash?.split('').forEach((e) => (n += e.charCodeAt(0)))
		const index = (n % 100) + 101
		return `https://assets.habr.com/habr-web/img/avatars/${index}.png`
	})
</script>

<img
	bind:this={ref}
	src={src || placeholderAvatarUrl}
	class={cn('animate-in fade-in aspect-square h-full w-full', className)}
	{...restProps}
/>
