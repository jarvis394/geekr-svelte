<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import { Button } from '$lib/components/ui/button'
	import { ScrollArea } from '$lib/components/ui/scroll-area'

	const { data }: PageProps = $props()
</script>

<div class="flex h-full w-full flex-col gap-4">
	{#await data.article}
		<div class="flex h-full w-full items-center justify-center">
			<LoaderCircle class="animate-spin" />
		</div>
	{:then article}
		<ScrollArea>
			<div class="flex flex-col gap-4 p-4">
				<div class="flex gap-2">
					<Button onclick={() => history.back()} size="sm" variant="outline">
						<ArrowLeft />Back
					</Button>
					<Button href={location.pathname + '/comments'} size="sm">Comments</Button>
				</div>
				<div
					class="prose prose-zinc dark:prose-invert prose-pre:border-[1px] animate-in fade-in break-words"
				>
					<h1>{@html article.titleHtml}</h1>
					{@html article.textHtml}
				</div>
			</div>
		</ScrollArea>
	{/await}
</div>
