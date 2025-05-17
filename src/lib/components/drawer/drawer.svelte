<script lang="ts">
	import Logo from '../logo/logo.svelte'
	import UserAvatarButton from '../user-avatar-button/user-avatar-button.svelte'
</script>

<div
	class="Drawer sticky top-0 z-50 h-fit w-[var(--drawer-width)] px-3 max-xl:shrink-0 max-lg:hidden"
>
	<a
		href="/"
		data-sveltekit-replacestate
		class="ring-default button button-ghost flex size-12 w-full items-center justify-center rounded-full p-0! min-xl:hidden"
	>
		<Logo class="size-[26px]" />
	</a>
	<a
		href="/"
		data-sveltekit-replacestate
		class="ring-default tap-hightlight px-2 flex h-12 items-center justify-start rounded-md max-xl:hidden"
	>
		<Logo withTitle class="mt-0.5 h-[26px]" />
	</a>
	<UserAvatarButton buttonProps={{ class: 'p-2' }} />
</div>

<style>
	.Drawer {
		view-transition-name: drawer;
	}
</style>
