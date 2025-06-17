<script lang="ts">
	import { ArticlePage } from '$lib/pages/article'
	import { Header } from '$lib/components/header'
	import type { PageProps } from '../../../routes/articles/[id=article]/$types'
	import { ArticleSkeleton } from '$lib/components/skeletons'
	import { fadeAbsolute } from '$lib/utils'

	const { data }: PageProps = $props()
	let articleTitle = $state(data.cachedArticle?.titleHtml)

	$effect(() => {
		data.article.then((res) => {
			articleTitle = res.titleHtml
		})
	})
</script>

<svelte:head>
	<title>{data.cachedArticle?.titleHtml || 'Статья'} / geekr.</title>
	<meta property="og:image" content={'https://geekr-lambda.vercel.app/api/share?id=' + data.id} />
	<meta property="og:description" content={data.cachedArticle?.metadata?.metaDescription} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>
<div class="relative flex h-full w-full flex-col">
	<Header withPositionBar withShrinking title={articleTitle} />
	{#await data.article}
		<div
			out:fadeAbsolute={{ duration: 200, disabled: !!data.cachedArticle?.textHtml }}
			class="top-12 -z-50 h-[1000000px] w-full"
		>
			<ArticleSkeleton withHeader />
		</div>
	{:then article}
		<ArticlePage {article} />
	{/await}
</div>
