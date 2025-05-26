<script lang="ts">
	import { ARTICLE_ITEM_IMAGE_HEIGHT } from '../article-item/article-item.svelte'
	import { Skeleton } from '../ui/skeleton'
</script>

<div class="animate-in fade-in border-border relative flex flex-col overflow-hidden border-b-[1px]">
	<Skeleton style={`height: ${ARTICLE_ITEM_IMAGE_HEIGHT}px;`} class="w-full rounded-none" />
	<div class="flex flex-col">
		<div class="flex flex-col gap-1 p-3 pb-0">
			<div class="mt-1 flex flex-row flex-wrap items-center gap-1.5 gap-y-0.5">
				<Skeleton class="h-3 w-28" />
				<Skeleton class="size-1.25" />
				<Skeleton class="h-3 w-36" />
			</div>
			<Skeleton class="mt-1 h-6 w-2/3" />
			<Skeleton class="mt-2 h-4 w-full" />
			<Skeleton class="h-4 w-19/20" />
			<Skeleton class="h-4 w-39/40" />
			<Skeleton class="h-4 w-18/20" />
			<Skeleton class="h-4 w-38/40" />
			<Skeleton class="h-4 w-37/40" />
			<Skeleton class="h-4 w-39/40" />
		</div>
		<div class="m-3 mt-1.5 mb-2 flex h-9 items-center justify-between">
			<div class="flex items-center gap-2">
				<Skeleton class="size-6 rounded-sm" />
				<Skeleton class="h-[15px] w-24" />
			</div>
			<Skeleton class="ml-1.5 h-4 w-36" />
		</div>
	</div>
</div>
