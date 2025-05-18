<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import * as Avatar from '../ui/avatar'
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
		'min-xl:bg-foreground/7 size-12 justify-start gap-2 rounded-full p-0 min-xl:w-full min-xl:rounded-xl min-xl:px-2',
		buttonProps?.class
	)}
>
	<Avatar.Root class={cn('border-foreground/4 h-8 w-8 rounded-full border', containerClasses)}>
		<Avatar.Image hash="jarvis394" alt="User avatar" />
	</Avatar.Root>
	<p class="font-heading mb-0.25 text-base max-xl:hidden">Владислав Екушев</p>
</Button>
