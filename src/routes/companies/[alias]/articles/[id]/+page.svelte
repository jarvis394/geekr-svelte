<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import { ArticlePage } from '$lib/components/article-page'
	import { Header } from '$lib/components/header'

	const { data }: PageProps = $props()
</script>

<svelte:head>
	<title>Статья / geekr.</title>
</svelte:head>
<div class="flex h-full w-full flex-col">
	{#await data.article}
		<Header />
		<div class="relative h-[10000px] w-full">
			<div class="sticky top-12 flex w-full items-center justify-center py-16">
				<LoaderCircle class="animate-spin" />
			</div>
		</div>
	{:then article}
		<Header withPositionBar withShrinking>{article.titleHtml}</Header>
		<ArticlePage {article} />
	{/await}
</div>
