<script lang="ts">
	import { Input } from '$lib/components/ui/input'
	import Search from 'lucide-svelte/icons/search'
</script>

{#snippet InputSearchIcon()}
	<Search class="text-muted-foreground size-5" />
{/snippet}
<Input
	before={InputSearchIcon}
	type="search"
	placeholder="Поиск"
	class="bg-accent w-full rounded-2xl border-0 text-[15px] leading-5"
/>
