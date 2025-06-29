<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { Avatar } from '../ui/avatar'
	import { cn } from '$lib/utils'
	import { Button, type ButtonProps } from '../ui/button'

	type UserAvatarButtonProps = HTMLAttributes<HTMLDivElement> & {
		buttonProps?: ButtonProps
	}
	const { class: containerClasses, buttonProps }: UserAvatarButtonProps = $props()
</script>

<Button
	{...buttonProps}
	variant={buttonProps?.variant || 'ghost'}
	class={cn(
		'transition-colors xl:bg-foreground/7 size-12 justify-start gap-2 rounded-full p-0 xl:w-full xl:rounded-xl xl:px-2',
		buttonProps?.class
	)}
	href="/auth"
>
	<Avatar
		hash="jarvis394"
		alt="User avatar"
		class={cn('border-foreground/4 h-8 w-8 rounded-full border', containerClasses)}
	/>
	<p class="font-heading mb-0.25 text-base max-xl:hidden">Владислав Екушев</p>
</Button>
