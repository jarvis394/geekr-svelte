<script lang="ts">
	import type { Article } from '$lib/types'
	import TextFormatter from '$lib/components/text-formatter/text-formatter.svelte'
	import { ArticleLabels } from '$lib/components/article-labels'
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn, fadeAbsolute, getArticleLink } from '$lib/utils'
	import { Link } from '$lib/components/link'
	import * as Avatar from '$lib/components/ui/avatar'
	import dayjs from 'dayjs'
	import { Button } from '$lib/components/ui/button'
	import { fade } from 'svelte/transition'
	import LoaderCircle from '@lucide/svelte/icons/loader-circle'

	type ArticlePageProps = {
		article: Article
		scrollElement?: HTMLDivElement
	} & HTMLAttributes<HTMLDivElement>
	let {
		article,
		class: containerClasses,
		scrollElement = $bindable(),
		...other
	}: ArticlePageProps = $props()
	const timestampText = $derived(dayjs(article.timePublished).calendar().toLowerCase())
	const isLoaded = $derived(article.textHtml)
	const articleLink = $derived(getArticleLink(article))
	const textFormatterClasses = $derived(article.editorVersion === '1.0' ? 'article--version-1' : '')
	// Have to sort hubs to prevent mismatch between
	// preview article hubs and full article hubs
	const sortedHubs = $derived.by(() => {
		const hubs = [...article.hubs]
		hubs.sort((a, b) => Number(a.id) - Number(b.id))
		return hubs
	})
</script>

<svelte:head>
	<title>{article.titleHtml} / geekr.</title>
</svelte:head>
<div {...other} class={cn('animate-in fade-in flex flex-col gap-4 p-4', containerClasses)}>
	<div class="flex flex-col" bind:this={scrollElement}>
		<div class="flex flex-col gap-3">
			<div class="flex flex-row gap-2">
				<Avatar.Root class="h-6 w-6">
					<Avatar.Image
						hash={article.author.alias}
						src={article.author.avatarUrl}
						alt={'@' + article.author.alias}
					/>
				</Avatar.Root>
				<h3 class="font-heading text-base font-medium">
					{article.author.alias}
				</h3>
				<p class="font-heading text-muted-foreground text-base font-medium">
					{timestampText}
				</p>
			</div>
			<h1 class="font-heading text-2xl font-bold">
				{@html article.titleHtml}
			</h1>
			<ArticleLabels scoreVariant="colored" {article} />
			<div class="flex flex-wrap gap-1.5">
				{#each sortedHubs as hub}
					<span class="Article__hub text-muted-foreground text-sm">
						<Link class="text-muted-foreground text-sm" href={'/hubs/' + hub.alias}>
							{hub.title}
						</Link>
					</span>
				{/each}
			</div>
		</div>
		<div class="relative mt-6">
			{#if isLoaded}
				<div in:fade={{ duration: 200 }}>
					<TextFormatter class={textFormatterClasses} html={article.textHtml} />
				</div>
			{:else}
				<div
					class="flex h-full w-full flex-col items-center gap-2 pb-4"
					out:fadeAbsolute={{ duration: 100 }}
				>
					<TextFormatter class={textFormatterClasses} html={article.leadData.textHtml} />
					<LoaderCircle class="animate-spin opacity-12" />
				</div>
			{/if}
		</div>
	</div>
	<Button href={articleLink + '/comments'} variant="ghost">Комментарии</Button>
</div>

<style>
	.Article__hub::after {
		content: ', ';
		z-index: 10;
		position: relative;
	}

	.Article__hub:last-child:after {
		content: '';
	}
</style>
