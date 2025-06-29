<script lang="ts">
	import { browser } from '$app/environment'
	import { openLightbox } from '$lib/hooks/lightbox.svelte'
	import { cn } from '$lib/utils'
	import IntersectionObserver from 'svelte-intersection-observer'
	import type { HTMLImgAttributes, HTMLAttributes } from 'svelte/elements'

	export type ImageProps = {
		src: string
		alt?: string
		disableZoom?: boolean
		placeholderSrc?: string
		containerProps?: HTMLAttributes<HTMLDivElement>
		loaded?: boolean
	} & HTMLImgAttributes

	let {
		src,
		placeholderSrc,
		alt,
		width,
		height,
		containerProps = {},
		class: imageClasses,
		disableZoom,
		style: propsStyle,
		loaded = $bindable(!browser),
		...other
	}: ImageProps = $props()
	const { class: containerClasses, style: containerStyle, ...otherContainerProps } = containerProps
	let shouldShowPlaceholder = $state(browser)
	let imageDimensions = $state({
		width: isNaN(Number(width)) ? 0 : Number(width),
		height: isNaN(Number(height)) ? 0 : Number(height)
	})
	// TODO: fix this mess / Probably was done for Habr articles formatting quirks, be careful
	const style = $derived(
		`aspect-ratio: ${imageDimensions.width || 'auto'} / ${imageDimensions.height || 'auto'};` +
			(propsStyle || containerStyle)
	)
	const shouldUseIntersectionObserver = $derived(
		imageDimensions.width === 0 && imageDimensions.height === 0
	)
	let element: HTMLElement | null = $state(null)
	let intersecting: boolean = $derived(!shouldUseIntersectionObserver)

	const handleLoad = (e: { currentTarget: EventTarget & Element }) => {
		loaded = true
		shouldShowPlaceholder = false
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
		if (!element) return

		const windowWidth = window.innerWidth - 32
		const scaleFactor = windowWidth / imageDimensions.width

		openLightbox({
			src,
			width: windowWidth,
			height: imageDimensions.height * scaleFactor,
			element
		})
	}
</script>

{#snippet image()}
	<div
		{...otherContainerProps}
		class={cn(
			'Image prose-img:m-0 bg-primary/3 relative inline-flex h-auto max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md align-middle transition-opacity',
			containerClasses,
			{ 'cursor-default': disableZoom },
			{ 'shimmer min-h-6': shouldShowPlaceholder && !placeholderSrc }
		)}
		style={containerStyle || style}
		data-loaded={loaded}
		bind:this={element}
	>
		{#if shouldShowPlaceholder && placeholderSrc}
			<img
				{...other}
				{alt}
				{width}
				{height}
				src={placeholderSrc}
				{style}
				class={cn(
					'no-drag pointer-events-none z-10 h-auto w-full max-w-full scale-105 blur-sm transition-all duration-500 ease-in-out data-[loaded="true"]:invisible data-[loaded="true"]:scale-100 data-[loaded="true"]:opacity-0',
					imageClasses
				)}
				data-loaded={loaded}
				onanimationend={handleAnimationEnd}
			/>
		{/if}
		{#if intersecting || !browser}
			<img
				{...other}
				{src}
				{alt}
				loading="eager"
				onload={handleLoad}
				onclick={handleClick}
				data-loaded={loaded}
				{style}
				{width}
				{height}
				class={cn(
					'no-drag z-0 h-auto w-full max-w-full opacity-0 transition-all duration-200 data-[loaded="true"]:opacity-100',
					{
						absolute: placeholderSrc && shouldShowPlaceholder
					},
					imageClasses
				)}
			/>
		{/if}
	</div>
{/snippet}

{#if shouldUseIntersectionObserver}
	<IntersectionObserver {element} once rootMargin="512px" bind:intersecting>
		{@render image()}
	</IntersectionObserver>
{:else}
	{@render image()}
{/if}
