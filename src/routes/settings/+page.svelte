<script lang="ts">
	import { Header } from '$lib/components/header'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { ChevronDown } from '@lucide/svelte'

	let viewTransitionsEnabled = $state(
		typeof window !== 'undefined' && localStorage.getItem('view-transitions') !== 'false'
	)
	const handleViewTransitionsClick = (newValue: boolean) => {
		viewTransitionsEnabled = newValue
		localStorage.setItem('view-transitions', newValue ? 'true' : 'false')
	}
</script>

<Header noBackButton title="Настройки" />

<div class="flex items-center justify-between p-4">
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
