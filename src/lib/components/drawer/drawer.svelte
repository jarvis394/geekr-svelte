<script lang="ts">
	import Logo from '../logo/logo.svelte'
	import { Home, Document } from '../svg'
	import { Button } from '../ui/button'
	import { Rss, Compass } from '@lucide/svelte'
	import UserAvatarButton from '../user-avatar-button/user-avatar-button.svelte'
</script>

<div
	class="Drawer sticky top-0 z-50 h-fit w-[var(--drawer-width)] px-3 max-xl:shrink-0 max-lg:hidden"
>
	<a
		href="/"
		data-sveltekit-replacestate
		class="ring-default button button-ghost flex size-12 w-full items-center justify-center rounded-full p-0! xl:hidden"
	>
		<Logo class="size-[26px]" />
	</a>
	<a
		href="/"
		data-sveltekit-replacestate
		class="ring-default tap-hightlight flex h-12 items-center justify-start rounded-md px-2 max-xl:hidden"
	>
		<Logo withTitle class="mt-0.5 h-[26px]" />
	</a>
	<UserAvatarButton buttonProps={{ class: 'p-2 mb-1' }} />
	<Button
		variant="ghost"
		size="lg"
		align="start"
		class="flex h-12 w-full p-3 [&_svg]:size-6"
		href="/"
	>
		<Home />
		Главная
	</Button>
	<Button
		variant="ghost"
		size="lg"
		align="start"
		class="flex h-12 w-full p-3 [&_svg]:size-6"
		href="/news"
	>
		<Rss />
		Новости
	</Button>
	<Button
		variant="ghost"
		size="lg"
		align="start"
		class="flex h-12 w-full p-3 [&_svg]:size-6"
		href="/posts"
	>
		<Document />
		Посты
	</Button>
	<Button variant="ghost" size="lg" align="start" class="flex h-12 w-full p-3 [&_svg]:size-6">
		<Compass />
		Хабы
	</Button>
</div>

<style>
	.Drawer {
		view-transition-name: drawer;
	}
</style>
