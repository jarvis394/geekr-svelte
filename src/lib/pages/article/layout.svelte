<script lang="ts">
	import { ArticlePage } from '$lib/pages/article'
	import { Header } from '$lib/components/header'
	import type { PageProps } from '../../../routes/articles/[id=article]/$types'
	import { ArticleSkeleton } from '$lib/components/skeletons'
	import { browser } from '$app/environment'
	import * as api from '$lib/api'
	import { getArticleQueryKey } from '$lib/utils'
	import { hydratable } from 'svelte'

	const { data, params }: PageProps = $props()

	const isServerRendered = $derived(!browser || false)

	// svelte-ignore state_referenced_locally
	const articlePromise = hydratable(getArticleQueryKey(params.id), async () => {
		const res = await api.article.get({
			id: params.id,
			fetch
		})

		if (!res.data) throw new Error('Not found')
		return res.data
	})

	let articleTitle = $derived.by(() => {
		// if (!('then' in article)) {
		// 	return article.titleHtml
		// }

		return data.cachedArticle?.titleHtml
	})

	$effect(() => {
		Promise.resolve(articlePromise).then((res) => {
			articleTitle = res.titleHtml
		})
	})
</script>

<svelte:head>
	<title>{articleTitle || 'Статья'} / geekr.</title>
	<meta property="og:image" content={'https://geekr-lambda.vercel.app/api/share?id=' + data.id} />
	<meta property="og:description" content={data.cachedArticle?.metadata?.metaDescription} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>
<div class="relative flex h-full w-full flex-col">
	<Header withPositionBar withShrinking title={articleTitle} />
	{#await articlePromise}
		<div class="top-12 -z-50 h-[1000000px] w-full">
			<ArticleSkeleton withHeader />
		</div>
	{:then article}
		<ArticlePage {article} {isServerRendered} />
	{/await}
</div>
