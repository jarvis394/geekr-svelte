<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import Logo from '../logo/logo.svelte'
	import UserAvatarButton from '../user-avatar-button/user-avatar-button.svelte'

	export type AppBarProps = HTMLAttributes<HTMLElement> & {
		spacerProps?: HTMLAttributes<HTMLElement>
	}

	const { class: containerClasses, spacerProps, ...other }: AppBarProps = $props()
</script>

<header
	{...other}
	class={cn(
		'AppBar bg-background/90 max-w-article fixed top-0 z-50 flex w-full flex-row items-center px-4 py-2 backdrop-blur-2xl',
		containerClasses
	)}
>
	<a
		href="/"
		data-sveltekit-replacestate
		class="ring-default tap-hightlight flex h-[32px] items-center rounded-sm"
	>
		<Logo withTitle class="h-[26px]" />
	</a>
	<div class="flex grow justify-end">
		<UserAvatarButton buttonProps={{ class: 'size-8' }} />
	</div>
</header>
<div {...spacerProps} class={cn('h-12 shrink-0', spacerProps?.class)}></div>

<style>
	.AppBar {
		view-transition-name: header;
	}
</style>
