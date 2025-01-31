<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import ArticlePage from '$lib/components/article-page/article-page.svelte'

	const { data }: PageProps = $props()
</script>

<div class="flex h-full w-full flex-col gap-4">
	{#await data.article}
		<div class="flex h-full w-full items-center justify-center">
			<LoaderCircle class="animate-spin" />
		</div>
	{:then article}
		<ArticlePage {article} />
	{/await}
</div>
