<script lang="ts">
	import { Header } from '$lib/components/header'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { ChevronDown } from '@lucide/svelte'

	let viewTransitionsEnabled = $state(
		typeof window !== 'undefined' && localStorage.getItem('view-transition') !== 'false'
	)
	let viewTransitionType = $state(
		(typeof window !== 'undefined' && localStorage.getItem('view-transition:type')) || 'scale'
	)
	const handleViewTransitionsClick = (newValue: boolean) => {
		viewTransitionsEnabled = newValue
		localStorage.setItem('view-transition', newValue ? 'true' : 'false')
	}
	const handleViewTransitionTypeClick = (newValue: 'scale' | 'slide') => {
		viewTransitionType = newValue
		localStorage.setItem('view-transition:type', newValue)
	}
</script>

<Header noBackButton title="Настройки" />

<div class="flex items-center justify-between px-4 py-1">
	Анимации перехода
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="button button-ghost gap-2 px-3.25 py-1.5 pb-1.75 text-lg font-medium"
		>
			{viewTransitionsEnabled ? 'Вкл.' : 'Откл.'}
			<ChevronDown strokeWidth={2.5} class="text-muted-foreground size-5" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start">
			<DropdownMenu.Item onclick={handleViewTransitionsClick.bind(null, true)}>
				Включены
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleViewTransitionsClick.bind(null, false)}>
				Отключены
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
<div class="flex items-center justify-between px-4 py-1">
	Вариант анимации
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="button button-ghost gap-2 px-3.25 py-1.5 pb-1.75 text-lg font-medium"
		>
			{viewTransitionType}
			<ChevronDown strokeWidth={2.5} class="text-muted-foreground size-5" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start">
			<DropdownMenu.Item onclick={handleViewTransitionTypeClick.bind(null, 'scale')}>
				scale
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleViewTransitionTypeClick.bind(null, 'slide')}>
				slide
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
