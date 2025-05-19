<script lang="ts">
	import { Skeleton } from '../ui/skeleton'
</script>

<div class="relative flex flex-row items-center gap-3 px-4 py-2">
	<div class="flex grow flex-col gap-2">
		<div class="flex w-full flex-col gap-1">
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-2/3" />
		</div>
		<div class="flex flex-row gap-1.5">
			<Skeleton class="size-4" />
			<Skeleton class="h-4 w-7" />
			<span class="w-1"></span>
			<Skeleton class="size-4" />
			<Skeleton class="h-4 w-7" />
		</div>
	</div>
	<Skeleton class="h-16 w-20 shrink-0" />
</div>
