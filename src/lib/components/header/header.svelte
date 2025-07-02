<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn, makeArticlesPageUrlFromParams } from '$lib/utils'
	import { useScrollTrigger } from '$lib/hooks/scrollTrigger.svelte'
	import ArrowLeft from '@lucide/svelte/icons/arrow-left'
	import { Button } from '../ui/button'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import getCachedMode from '$lib/utils/getCachedMode'
	import { Tween } from 'svelte/motion'
	import { expoOut } from 'svelte/easing'
	import { MediaQuery } from 'svelte/reactivity'

	export type HeaderProps = {
		title?: string
		scrollThreshold?: number
		scrollElement?: HTMLElement | null
		divider?: boolean
		noBackButton?: boolean
		withShrinking?: boolean
		withPositionBar?: boolean
	} & HTMLAttributes<HTMLElement>

	const hiddenClasses = 'opacity-0 pointer-events-none'
	const {
		title,
		class: containerClasses,
		scrollElement = typeof document !== 'undefined' ? document.getElementById('main') : undefined,
		withPositionBar,
		withShrinking,
		children,
		style,
		noBackButton,
		...other
	}: HeaderProps = $props()
	const isSingleColumnMode = new MediaQuery('max-width: 1023px')
	const scrollTrigger = $derived(
		useScrollTrigger({
			defaultValue: false,
			enabled: withShrinking ? isSingleColumnMode.current : false
		})
	)
	const isShrunk = $derived(scrollTrigger.trigger)
	const noTitleOnFirstRender = !title
	const handleBack = () => {
		// @ts-expect-error Chrome specific API
		const canGoBackChrome = window?.navigation?.canGoBack
		const canGoBack = canGoBackChrome !== undefined ? canGoBackChrome : window.history.length > 0

		if (canGoBack) {
			history.back()
		} else {
			goto(makeArticlesPageUrlFromParams(getCachedMode()), {
				replaceState: true
			})
		}
	}

	const getScrollProgress = () => {
		const docElement = typeof document !== 'undefined' ? document.documentElement : null
		const element = docElement
		const progress = element && element.scrollTop / (element.scrollHeight - element.clientHeight)
		return element ? Math.min(progress || 0, 1) : 0
	}

	let scrollProgress = new Tween(withPositionBar ? getScrollProgress() : 0, {
		easing: expoOut,
		duration: 100
	})

	const scrollCallback = () =>
		requestAnimationFrame(() => {
			scrollProgress.set(getScrollProgress())
		})

	onMount(() => {
		let rAF = 0
		let resizeObserver: ResizeObserver | undefined

		if (withPositionBar) {
			// Reset scroll trigger state, as it might be `false` when navigating from previous page
			scrollTrigger.trigger = false
			// passive: true enhances scrolling experience
			window?.addEventListener('scroll', scrollCallback, { passive: true })

			/**
			 * Resize Observer will throw an often benign error that says `ResizeObserver loop
			 * completed with undelivered notifications`. This means that ResizeObserver was not
			 * able to deliver all observations within a single animation frame, so we use
			 * `requestAnimationFrame` to ensure we don't deliver unnecessary observations.
			 * Further reading: https://github.com/WICG/resize-observer/issues/38
			 */
			resizeObserver = new ResizeObserver(() => {
				cancelAnimationFrame(rAF)
				rAF = scrollCallback()
			})

			scrollElement && resizeObserver.observe(scrollElement)
		}

		return () => {
			cancelAnimationFrame(rAF)
			window?.removeEventListener('scroll', scrollCallback)
			scrollElement && resizeObserver?.unobserve(scrollElement)
		}
	})
</script>

<header
	{...other}
	class={cn(
		'Header bg-background/90 text-primary font-heading max-w-article fixed top-0 z-50 flex w-full flex-row items-center gap-1 overflow-hidden pr-2 pl-1 backdrop-blur-xl transition-colors select-none',
		containerClasses,
		{ 'bg-sidebar': isShrunk, 'Header--withPositionBar': withPositionBar }
	)}
	data-shrunk={isShrunk}
	data-progressed={scrollProgress.current > 0}
	style={[style, `--progress: ${scrollProgress.current * 100}%`].join(';')}
>
	<div
		class={cn('Header__toolbar flex h-12 flex-row items-center gap-1 overflow-hidden', {
			'h-8': isShrunk
		})}
	>
		{#if !noBackButton}
			<Button
				onclick={handleBack}
				size="icon"
				class={['size-12 rounded-full [&_svg]:size-6', isShrunk && hiddenClasses]}
				variant="ghost"
			>
				<ArrowLeft />
			</Button>
		{/if}
		{#if title}
			<p
				class={[
					'mr-4 w-full overflow-hidden text-xl font-medium text-nowrap text-ellipsis',
					isShrunk && hiddenClasses,
					{
						'ml-3': noBackButton,
						'animate-in fade-in': noTitleOnFirstRender
					}
				]}
			>
				{title}
			</p>
			<p
				class={[
					'Header__shrinkedTitle animate-in fade-in text-muted-foreground text-md absolute left-3 w-full overflow-hidden font-medium text-nowrap text-ellipsis',
					!isShrunk && hiddenClasses
				]}
			>
				{title}
			</p>
		{/if}
		{@render children?.()}
	</div>
</header>
<div class="h-12 shrink-0"></div>

<style>
	.Header.Header--withPositionBar::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: var(--progress);
		z-index: -1;
		opacity: 0;
		background-color: currentColor;
		transition: opacity 500ms ease;
	}

	.Header[data-progressed='true'].Header--withPositionBar::before {
		opacity: 0.12;
	}

	.Header {
		padding-top: var(--insetTop, env(safe-area-inset-top));
	}

	.Header__toolbar {
		will-change: transform;
		transition: height 250ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.Header__toolbar > p {
		transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.Header__shrinkedTitle {
		max-width: calc(100% - var(--spacing) * 8);
	}
</style>
