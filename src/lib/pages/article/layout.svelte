<script lang="ts">
	import { ArticlePage } from '$lib/pages/article'
	import { Header } from '$lib/components/header'
	import LoaderCircle from '@lucide/svelte/icons/loader-circle'
	import type { PageProps } from '../../../routes/articles/[id=article]/$types'

	const { data }: PageProps = $props()
	let article = $state(data.cachedArticle)

	$effect(() => {
		void data.article.then((res) => {
			if (JSON.stringify(res) === JSON.stringify(article)) {
				return
			}

			article = res
		})
	})
</script>

<svelte:head>
	<title>Статья / geekr.</title>
</svelte:head>
<div class="flex h-full w-full flex-col">
	<Header withPositionBar withShrinking title={article?.titleHtml} />
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
