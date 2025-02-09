<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import { ArticlePage } from '$lib/components/article-page'
	import { Header } from '$lib/components/header'

	const { data }: PageProps = $props()
</script>

<div class="flex h-full w-full flex-col">
	{#await data.article}
		<Header />
		<div class="flex h-full w-full items-center justify-center">
			<LoaderCircle class="animate-spin" />
		</div>
	{:then article}
		<Header withPositionBar withShrinking>{article.titleHtml}</Header>
		<ArticlePage {article} />
	{/await}
</div>
