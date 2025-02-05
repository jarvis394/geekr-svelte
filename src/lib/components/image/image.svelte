<script lang="ts">
	import { cn } from '$lib/utils.js'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { HTMLImgAttributes, HTMLAttributes } from 'svelte/elements'
	import { fade } from 'svelte/transition'

	export type ImageProps = {
		src: string
		alt?: string
		placeholderSrc?: string
		containerProps?: HTMLAttributes<HTMLDivElement>
	} & HTMLImgAttributes

	const {
		src,
		placeholderSrc,
		alt,
		containerProps = {},
		class: imageClasses,
		...other
	}: ImageProps = $props()
	const { class: containerClasses, ...otherContainerProps } = containerProps
	let shouldShowPlaceholder = $state(false)
	let loaded = $state(true)

	const handleLoad = () => {
		loaded = true
	}

	const handleAnimationEnd = () => {
		shouldShowPlaceholder = false
	}
</script>

<div
	{...otherContainerProps}
	class={cn(
		'prose-img:m-0 bg-primary/3 relative inline-flex h-auto max-w-full flex-col items-center justify-center overflow-hidden rounded-md align-middle',
		containerClasses
	)}
>
	{#if shouldShowPlaceholder}
		{#if placeholderSrc}
			<img
				{...other}
				{alt}
				src={placeholderSrc}
				loading="eager"
				class={cn(
					'no-drag z-10 scale-105 blur-sm transition-all duration-500 ease-in-out data-[loaded]:scale-100 data-[loaded]:opacity-0',
					imageClasses
				)}
				data-loaded={loaded}
				onanimationend={handleAnimationEnd}
			/>
		{:else}
			<LoaderCircle
				onanimationend={handleAnimationEnd}
				data-loaded={loaded}
				class="animate-spin transition-all duration-500 data-[loaded]:opacity-0"
			/>
		{/if}
	{/if}
	<img
		{...other}
		{src}
		{alt}
		onload={handleLoad}
		class={cn('fade-in animate-in no-drag z-0', imageClasses)}
		class:absolute={placeholderSrc && shouldShowPlaceholder}
		loading="lazy"
	/>
</div>
