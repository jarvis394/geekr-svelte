<script lang="ts">
	import { ArticlePage } from '$lib/components/article-page'
	import { Header } from '$lib/components/header'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from '../../../routes/articles/[id=article]/$types'

	const { data }: PageProps = $props()

	let article = $state(data.cachedArticle)
	$effect(() => {
		void data.article.then((value) => {
			article = value
		})
	})
</script>

<svelte:head>
	<title>Статья / geekr.</title>
</svelte:head>
<div class="flex h-full w-full flex-col">
	<Header withPositionBar withShrinking>{article?.titleHtml}</Header>
	{#if article}
		<ArticlePage {article} />
	{:else}
		<div class="relative h-[50000px] w-full">
			<div class="sticky top-12 flex w-full items-center justify-center py-16">
				<LoaderCircle class="animate-spin" />
			</div>
		</div>
	{/if}
</div>
