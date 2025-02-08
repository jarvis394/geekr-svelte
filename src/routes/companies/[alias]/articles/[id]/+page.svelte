<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import { ArticlePage } from '$lib/components/article-page'
	import { AppBar } from '$lib/components/appbar'

	const { data }: PageProps = $props()
</script>

<AppBar />
<div class="flex h-full w-full flex-col">
	{#await data.article}
		<div class="flex h-full w-full items-center justify-center">
			<LoaderCircle class="animate-spin" />
		</div>
	{:then article}
		<ArticlePage {article} />
	{/await}
</div>
