<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import Logo from '../logo/logo.svelte'
	import * as Avatar from '$lib/components/ui/avatar'

	export type AppBarProps = HTMLAttributes<HTMLElement>

	const { class: containerClasses, ...other }: AppBarProps = $props()
</script>

<header
	{...other}
	class={cn(
		'AppBar bg-background fixed top-0 z-50 flex w-full max-w-2xl flex-row items-center px-4 py-2',
		containerClasses
	)}
>
	<a href="/" class="ring-default tap-hightlight flex h-[32px] items-center rounded-sm">
		<Logo withTitle class="h-[26px]" />
	</a>
	<div class="flex grow justify-end">
		<Avatar.Root class="border-foreground/4 h-8 w-8 rounded-md border">
			<Avatar.Image hash={'jarvis394'} alt="User avatar" />
		</Avatar.Root>
	</div>
</header>
<div class="h-12"></div>

<style>
	.AppBar {
		view-transition-name: header;
	}
</style>
