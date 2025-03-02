import { pushState } from '$app/navigation'
import type { PreparedPhotoSwipeOptions } from 'photoswipe'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { onMount } from 'svelte'

const closeSVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
const zoomSVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>'

const lightboxOptions: Partial<PreparedPhotoSwipeOptions> = {
	clickToCloseNonZoomable: true,
	showHideOpacity: true,
	showAnimationDuration: 300,
	hideAnimationDuration: 300,
	bgOpacity: 0.8,
	pinchToClose: true,
	bgClickAction: 'close',
	arrowNext: false,
	arrowPrev: false,
	wheelToZoom: true,
	closeOnVerticalDrag: true,
	counter: false,
	closeSVG,
	zoomSVG,
	close: true,
	pswpModule: () => import('photoswipe')
}
export const lightbox = new PhotoSwipeLightbox(lightboxOptions)

type OpenLightboxProps = {
	src: string
	width: number
	height: number
}

let shouldDisablePswpCloseHandler = $state(false)

export const openLightbox = ({ src, width, height }: OpenLightboxProps) => {
	lightbox.options.dataSource = [
		{
			src,
			width,
			height
		}
	]

	lightbox.loadAndOpen(0)

	pushState('', {
		noScroll: true
	})

	shouldDisablePswpCloseHandler = false
}

export const useLightbox = () => {
	onMount(() => {
		const handleBack = () => {
			shouldDisablePswpCloseHandler = true
			lightbox.pswp?.close()
		}

		window.addEventListener('popstate', handleBack)

		return () => {
			window.removeEventListener('popstate', handleBack)
		}
	})

	$effect(() => {
		const stopPropagation = (e: Event) => {
			e.preventDefault()
			e.stopPropagation()
		}

		// Tries to fix focus trap issues on mobile
		lightbox.on('afterInit', () => {
			document.querySelector('.pswp__container')?.addEventListener('touchstart', stopPropagation, {
				passive: false
			})
		})

		lightbox.on('close', () => {
			if (shouldDisablePswpCloseHandler) return
			window.history.back()
		})

		return () => {
			document.querySelector('.pswp__container')?.removeEventListener('touchstart', stopPropagation)
		}
	})
}
