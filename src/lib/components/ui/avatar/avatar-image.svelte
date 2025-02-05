<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils.js'

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
		let n = 0
		hash?.split('').forEach((e) => (n += e.charCodeAt(0)))
		const index = (n % 100) + 101
		return `https://assets.habr.com/habr-web/img/avatars/${index}.png`
	})
</script>

<AvatarPrimitive.Image
	bind:ref
	src={src || placeholderAvatarUrl}
	class={cn('fade-in animate-in aspect-square h-full w-full', className)}
	{...restProps}
/>
