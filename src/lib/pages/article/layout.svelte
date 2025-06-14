<script lang="ts">
	import { ArticlePage } from '$lib/pages/article'
	import { Header } from '$lib/components/header'
	import LoaderCircle from '@lucide/svelte/icons/loader-circle'
	import type { PageProps } from '../../../routes/articles/[id=article]/$types'
	import { ArticleSkeleton } from '$lib/components/skeletons'
	import { fadeAbsolute } from '$lib/utils'

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
	<title>{article?.titleHtml || 'Статья'} / geekr.</title>
	<meta property="og:image" content={'https://geekr-lambda.vercel.app/api/share?id=' + data.id} />
	<meta property="og:description" content={article?.metadata?.metaDescription} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>
<div class="relative flex h-full w-full flex-col">
	<Header withPositionBar withShrinking title={article?.titleHtml} />
	{#if article}
		<ArticlePage {article} />
	{:else}
		<div out:fadeAbsolute={{ duration: 200 }} class="-z-50 top-12 h-[1000000px] w-full">
			<ArticleSkeleton withHeader />
		</div>
	{/if}
</div>
