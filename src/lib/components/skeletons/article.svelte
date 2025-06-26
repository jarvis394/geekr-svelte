<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { Skeleton } from '../ui/skeleton'
	import { cn } from '$lib/utils'

	const {
		withHeader,
		class: containerClasses,
		...other
	}: { withHeader?: boolean } & HTMLAttributes<HTMLDivElement> = $props()
</script>

<div {...other} class={cn('relative flex w-full flex-col gap-1 p-4', containerClasses)}>
	{#if withHeader}
		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-2">
				<Skeleton class="size-6" />
				<Skeleton class="h-4 w-32" />
			</div>
			<div class="flex flex-col gap-1.5">
				<Skeleton class="h-7 w-18/20" />
				<Skeleton class="h-7 w-12/20" />
			</div>
			<Skeleton class="mt-0.5 h-6 w-12" />
			<div class="flex flex-wrap gap-1">
				<Skeleton class="h-5 w-32" />
				<Skeleton class="h-5 w-64" />
				<Skeleton class="h-5 w-52" />
			</div>
		</div>
	{/if}
	<Skeleton
		style="aspect-ratio: 380 / 220"
		class={cn('mb-4 w-full', {
			'mt-5': withHeader
		})}
	/>
	<Skeleton class="h-4 w-19/20" />
	<Skeleton class="h-4 w-39/40" />
	<Skeleton class="h-4 w-18/20" />
	<Skeleton class="h-4 w-38/40" />
	<Skeleton class="h-4 w-37/40" />
	<Skeleton class="h-4 w-39/40" />
	<Skeleton class="h-4 w-38/40" />
	<Skeleton class="h-4 w-37/40" />
	<Skeleton class="h-4 w-38/40" />
	<Skeleton class="h-4 w-39/40" />
	<Skeleton class="h-4 w-18/20" />
	<Skeleton class="h-4 w-39/40" />
	<Skeleton class="h-4 w-19/20" />
	<Skeleton class="h-4 w-38/40" />
	<Skeleton class="h-4 w-18/20" />
	<Skeleton class="h-4 w-39/40" />
	<Skeleton class="h-4 w-18/20" />
	<Skeleton class="h-4 w-39/40" />
	<Skeleton class="h-4 w-18/20" />
	<Skeleton class="h-4 w-39/40" />
	<Skeleton class="h-4 w-19/20" />
</div>
