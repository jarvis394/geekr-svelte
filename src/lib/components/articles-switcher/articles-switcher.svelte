<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import Button from '../ui/button/button.svelte'
	import Settings from 'lucide-svelte/icons/settings'
	import { cn } from '$lib/utils'
	import * as Drawer from '$lib/components/ui/drawer'

	export type ArticlesSwitcherProps = HTMLAttributes<HTMLDivElement>

	const { class: containerClasses, ...other }: ArticlesSwitcherProps = $props()
	let open = $state(false)
</script>

<div
	{...other}
	class={cn('flex flex-row items-center gap-1 overflow-x-auto p-2 pt-1', containerClasses)}
>
	<Button variant="default" class="rounded-xl text-base font-medium">Топ дня</Button>
	<Button variant="secondary" class="rounded-xl text-base font-medium">Топ недели</Button>
	<Button variant="secondary" class="rounded-xl text-base font-medium">Новые</Button>
	<Drawer.Root>
		<Drawer.Trigger>
			<Button
				size="icon"
				variant="secondary"
				class="rounded-xl p-2 text-base font-medium [&_svg]:size-5"
			>
				<Settings strokeWidth={2} />
			</Button>
		</Drawer.Trigger>

		<Drawer.Portal>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Are you sure absolutely sure?</Drawer.Title>
					<Drawer.Description>This action cannot be undone.</Drawer.Description>
				</Drawer.Header>
				<Drawer.Footer>
					<Button>Submit</Button>
					<Drawer.Close>Cancel</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
</div>
