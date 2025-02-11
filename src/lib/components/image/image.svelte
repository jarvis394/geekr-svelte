<script lang="ts">
	import { cn } from '$lib/utils'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import PhotoSwipeLightbox from 'photoswipe/lightbox'
	import type { HTMLImgAttributes, HTMLAttributes } from 'svelte/elements'

	export type ImageProps = {
		src: string
		alt?: string
		disableZoom?: boolean
		placeholderSrc?: string
		containerProps?: HTMLAttributes<HTMLDivElement>
	} & HTMLImgAttributes

	const closeSVG =
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
	const {
		src,
		placeholderSrc,
		alt,
		containerProps = {},
		class: imageClasses,
		disableZoom,
		...other
	}: ImageProps = $props()
	const { class: containerClasses, ...otherContainerProps } = containerProps
	let shouldShowPlaceholder = $state(false)
	let loaded = $state(true)
	let imageDimensions = $state({ width: 0, height: 0 })

	const handleLoad = (e: { currentTarget: EventTarget & Element }) => {
		const rect = e.currentTarget.getBoundingClientRect()
		loaded = true
		imageDimensions = {
			width: rect?.width || 0,
			height: rect?.height || 0
		}
	}

	const handleAnimationEnd = () => {
		shouldShowPlaceholder = false
	}

	const handleClick = () => {
		if (disableZoom) return

		const windowWidth = window.innerWidth - 32
		const scaleFactor = windowWidth / imageDimensions.width

		const lightbox = new PhotoSwipeLightbox({
			dataSource: [
				{
					src,
					width: window.innerWidth - 32,
					height: imageDimensions.height * scaleFactor
				}
			],
			showHideOpacity: true,
			showAnimationDuration: 300,
			hideAnimationDuration: 300,
			bgOpacity: 0.8,
			pinchToClose: false,
			bgClickAction: 'close',
			maxZoomLevel: 4,
			arrowNext: false,
			arrowPrev: false,
			wheelToZoom: true,
			closeOnVerticalDrag: true,
			counter: false,
			closeSVG,
			close: true,
			pswpModule: () => import('photoswipe')
		})
		lightbox.init()
		lightbox.loadAndOpen(0)
	}
</script>

<div
	{...otherContainerProps}
	class={cn(
		'Image prose-img:m-0 bg-primary/3 relative inline-flex h-auto max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md align-middle',
		containerClasses
	)}
	id={src}
	data-loaded={loaded}
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
		onclick={handleClick}
		data-loaded={loaded}
		class={cn('fade-in animate-in no-drag z-0', imageClasses)}
		class:absolute={placeholderSrc && shouldShowPlaceholder}
		loading="lazy"
	/>
</div>
