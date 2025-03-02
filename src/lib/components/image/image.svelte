<script lang="ts">
	import { openLightbox } from '$lib/hooks/lightbox.svelte'
	import { cn } from '$lib/utils'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import IntersectionObserver from 'svelte-intersection-observer'
	import type { HTMLImgAttributes, HTMLAttributes } from 'svelte/elements'

	export type ImageProps = {
		src: string
		alt?: string
		disableZoom?: boolean
		placeholderSrc?: string
		containerProps?: HTMLAttributes<HTMLDivElement>
	} & HTMLImgAttributes

	const {
		src,
		placeholderSrc,
		alt,
		width = 'initial',
		height = 'initial',
		containerProps = {},
		class: imageClasses,
		disableZoom,
		...other
	}: ImageProps = $props()
	const { class: containerClasses, style, ...otherContainerProps } = containerProps
	let shouldShowPlaceholder = $state(true)
	let loaded = $state(false)
	let imageDimensions = $state({
		width: isNaN(Number(width)) ? 0 : Number(width),
		height: isNaN(Number(height)) ? 0 : Number(height)
	})
	let element: HTMLElement | null = $state(null)
	let intersecting: boolean = $state(false)

	const handleLoad = (e: { currentTarget: EventTarget & Element }) => {
		loaded = true
		imageDimensions = {
			width: (e.currentTarget as HTMLImageElement).naturalWidth || 0,
			height: (e.currentTarget as HTMLImageElement).naturalHeight || 0
		}
	}

	const handleAnimationEnd = () => {
		shouldShowPlaceholder = false
	}

	const handleClick = () => {
		if (disableZoom) return

		const windowWidth = window.innerWidth - 32
		const scaleFactor = windowWidth / imageDimensions.width

		openLightbox({
			src,
			width: windowWidth,
			height: imageDimensions.height * scaleFactor
		})
	}
</script>

<IntersectionObserver {element} once threshold={0} bind:intersecting>
	<div
		{...otherContainerProps}
		class={cn(
			'Image prose-img:m-0 bg-primary/3 relative inline-flex h-auto max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md align-middle transition-all',
			containerClasses
		)}
		{style}
		data-loaded={loaded}
		bind:this={element}
	>
		{#if shouldShowPlaceholder}
			{#if placeholderSrc}
				<img
					{...other}
					{alt}
					src={placeholderSrc}
					class={cn(
						'no-drag pointer-events-none z-10 h-auto w-full scale-105 blur-sm transition-all duration-500 ease-in-out data-[loaded="true"]:invisible data-[loaded="true"]:scale-100 data-[loaded="true"]:opacity-0',
						imageClasses
					)}
					data-loaded={loaded}
					onanimationend={handleAnimationEnd}
				/>
			{:else}
				<LoaderCircle
					onanimationend={handleAnimationEnd}
					data-loaded={loaded}
					class={'text-muted-foreground pointer-events-none absolute animate-spin transition-all duration-500 data-[loaded="true"]:invisible data-[loaded="true"]:opacity-0'}
				/>
			{/if}
		{/if}
		{#if intersecting}
			<img
				{...other}
				{src}
				{alt}
				onload={handleLoad}
				onclick={handleClick}
				data-loaded={loaded}
				class={cn(
					'no-drag z-0 h-auto w-full opacity-0 transition-all duration-250 data-[loaded="true"]:opacity-100',
					imageClasses
				)}
				class:absolute={placeholderSrc && shouldShowPlaceholder}
			/>
		{/if}
	</div>
</IntersectionObserver>
