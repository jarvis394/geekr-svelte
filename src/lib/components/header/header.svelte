<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import { state as scrollTriggerState } from '$lib/hooks/scrollTrigger.svelte'
	import ArrowLeft from 'lucide-svelte/icons/arrow-left'
	import { Button } from '../ui/button'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'

	export type HeaderProps = {
		scrollThreshold?: number
		scrollElement?: HTMLElement
		divider?: boolean
		withShrinking?: boolean
		withPositionBar?: boolean
	} & HTMLAttributes<HTMLElement>

	const hiddenClasses = 'opacity-0 pointer-events-none'
	const {
		class: containerClasses,
		scrollElement,
		withPositionBar,
		withShrinking,
		children,
		style,
		...other
	}: HeaderProps = $props()
	const isShrunk = $derived(scrollTriggerState.trigger && withShrinking)

	const handleBack = () => {
		if (history.length > 1) {
			history.back()
		} else {
			goto('/articles')
		}
	}

	const getScrollProgress = () => {
		const docElement = typeof document !== 'undefined' ? document.documentElement : null
		const element = scrollElement || docElement
		const progress =
			element && element.scrollTop / (element.scrollHeight - element.clientHeight - 200)
		return element ? Math.min(progress || 0, 1) : 0
	}

	let scrollProgress = $state(getScrollProgress())

	const scrollCallback = () =>
		requestAnimationFrame(() => {
			scrollProgress = getScrollProgress()
		})

	onMount(() => {
		if (withPositionBar) {
			// Reset scroll trigger state, as it might be `false` when navigating from previous page
			scrollTriggerState.trigger = false
			// passive: true enhances scrolling experience
			window.addEventListener('scroll', scrollCallback, { passive: true })
			return () => window.removeEventListener('scroll', scrollCallback)
		}
	})
</script>

<header
	{...other}
	class={cn(
		'Header bg-background text-primary font-heading fixed top-0 z-50 flex h-12 w-full max-w-xl flex-row items-center gap-1 overflow-hidden pr-2 pl-1 select-none',
		containerClasses,
		{ 'bg-sidebar h-8': isShrunk, 'Header--withPositionBar': withPositionBar }
	)}
	style={[style, `--progress: ${scrollProgress * 100}%`].join(';')}
>
	<Button
		onclick={handleBack}
		size="icon"
		class={['size-12 rounded-full [&_svg]:size-6', isShrunk && hiddenClasses]}
		variant="ghost"
	>
		<ArrowLeft />
	</Button>
	<p
		class={[
			'animate-in fade-in mr-4 w-full overflow-hidden text-xl font-medium text-nowrap text-ellipsis',
			isShrunk && hiddenClasses
		]}
	>
		{@render children?.()}
	</p>
	<p
		class={[
			'Header__shrinkedTitle animate-in fade-in text-muted-foreground text-md absolute left-4 w-full overflow-hidden font-medium text-nowrap text-ellipsis',
			!isShrunk && hiddenClasses
		]}
	>
		{@render children?.()}
	</p>
</header>
<div class="h-12"></div>

<style>
	.Header {
		view-transition-name: header;
	}

	.Header.Header--withPositionBar::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: var(--progress);
		z-index: -1;
		opacity: 0.12;
		background-color: currentColor;
	}

	.Header {
		will-change: transform;
		transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.Header > p {
		transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.Header__shrinkedTitle {
		max-width: calc(100% - var(--spacing) * 8);
	}
</style>
