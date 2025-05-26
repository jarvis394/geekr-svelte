<script lang="ts">
	import Image from '../image/image.svelte'
	import { cn, formatNumber } from '$lib/utils'
	import type { Article } from '$lib/types'
	import type { HTMLAttributes } from 'svelte/elements'
	import { Eye, MessageSquare } from '@lucide/svelte'
	import { useArticleItem } from './article-item.svelte'

	type ArticleItemProps = { article: Article } & HTMLAttributes<HTMLAnchorElement>
	const { class: containerClasses, article, ...other }: ArticleItemProps = $props()
	const { titlePlaintext, leadImage, articleLink } = $derived(useArticleItem(article))
	const viewsText = formatNumber(article.statistics.readingCount)
	const commentsText = formatNumber(article.statistics.commentsCount)
</script>

<a
	{...other}
	href={articleLink}
	title={titlePlaintext}
	class={cn('relative flex flex-row items-center gap-3 px-4 py-2', containerClasses)}
>
	<div class="z-10 flex grow flex-col gap-1">
		<h3 class="font-heading text-primary line-clamp-3 text-sm font-bold">{titlePlaintext}</h3>
		<p
			class="font-heading text-muted-foreground dark:text-hint flex w-full flex-row items-center gap-1.5 overflow-hidden text-sm font-medium text-nowrap text-ellipsis"
		>
			<Eye class="size-4" strokeWidth={2.5} />
			{viewsText}
			<span class="w-1"></span>
			<MessageSquare class="size-4" strokeWidth={2.5} />
			{commentsText}
		</p>
	</div>
	{#if leadImage}
		<Image
			disableZoom
			src={leadImage}
			class="h-16 w-20 object-cover"
			containerProps={{ class: 'h-16 w-20 rounded-md shrink-0 z-10' }}
		/>
	{/if}
	<md-ripple></md-ripple>
</a>
