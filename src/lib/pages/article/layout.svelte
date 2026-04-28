<script lang="ts">
	import { ArticlePage } from '$lib/pages/article'
	import { Header } from '$lib/components/header'
	import type { PageProps } from '../../../routes/articles/[id=article]/$types'
	import { ArticleSkeleton } from '$lib/components/skeletons'
	import { onMount } from 'svelte'
	// import { browser } from '$app/environment'

	const { data, params }: PageProps = $props()

	// const isServerRendered = $derived(!browser)
	const isServerRendered = true

	let articleTitle = $derived.by(() => {
		if (!('then' in data.article.promise)) {
			return data.article.promise?.titleHtml
		}

		return data.cachedArticle?.titleHtml
	})
	let articleDescription = $derived.by(() => {
		if (!('then' in data.article.promise)) {
			return data.article.promise.metadata?.metaDescription
		}

		return data.cachedArticle?.metadata?.metaDescription
	})

	onMount(() => {
		Promise.resolve(data.article.promise).then((res) => {
			articleTitle = res.titleHtml
		})
	})
</script>

<svelte:head>
	<title>{articleTitle || 'Статья'} / geekr.</title>
	<meta property="og:image" content={'https://geekr-lambda.vercel.app/api/share?id=' + params.id} />
	<meta property="og:description" content={articleDescription} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>
<div class="relative flex h-full w-full flex-col">
	<Header withPositionBar withShrinking title={articleTitle} />
	{#await data.article.promise}
		<div class="top-12 z-50 h-[1000000px] w-full">
			<ArticleSkeleton withHeader />
		</div>
	{:then article}
		<ArticlePage {article} {isServerRendered} />
	{/await}
</div>
