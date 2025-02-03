<script lang="ts">
	import type { Article } from '$lib/types'
	import formatNumber from '$lib/utils/formatNumber'
	import getArticleLink from '$lib/utils/getArticleLink'
	import parsePreviewTextHtml from '$lib/utils/parsePreviewTextHTML'
	import dayjs from 'dayjs'
	import * as Avatar from '$lib/components/ui/avatar'
	import { Button } from '../ui/button'
	import type { HTMLAttributes } from 'svelte/elements'

	type ArticleItemProps = { article: Article } & HTMLAttributes<HTMLAnchorElement>
	const { article, ...other }: ArticleItemProps = $props()

	const titlePlaintext = $derived(parsePreviewTextHtml(article.titleHtml))
	const parsedPreviewText = $derived(parsePreviewTextHtml(article.leadData.textHtml))
	const articleLink = $derived(getArticleLink(article))
	const timestampText = $derived(dayjs(article.timePublished).calendar())
	const viewsText = $derived(
		formatNumber(article.statistics.readingCount, ['просмотр', 'просмотра', 'просмотров'])
	)
	const commentsText = $derived(
		formatNumber(article.statistics.commentsCount, ['комментарий', 'комментариев', 'комментариев'])
	)
	const authorNameFallback = $derived(article.author?.fullname?.slice(0, 2)?.toUpperCase())
</script>

<a
	{...other}
	href={articleLink}
	class="animate-in fade-in border-border flex flex-col border-b-[1px]"
>
	<div class="relative">
		{#if article.leadImage || article.leadData.imageUrl}
			<div class="flex h-auto max-h-[212px] w-full flex-col overflow-hidden">
				<img
					class="h-auto w-full object-cover"
					src={article.leadImage || article.leadData.imageUrl}
					alt={titlePlaintext}
				/>
			</div>
		{/if}

		<div class="flex flex-col gap-1.5 p-3 pb-2">
			<div class="flex flex-col gap-1">
				<div class="text-hint flex flex-row gap-2 text-[13px]/[17px] font-medium">
					{timestampText}<span>•</span>{viewsText}
				</div>
				<h2 class="text-primary text-xl font-bold">{titlePlaintext}</h2>
				<p class="text-muted-foreground line-clamp-7 text-[15px]/5">{parsedPreviewText}</p>
			</div>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Avatar.Root class="h-6 w-6">
						<Avatar.Image src={article.author.avatarUrl} alt={'@' + article.author.alias} />
						<Avatar.Fallback class="text-xs font-medium">{authorNameFallback}</Avatar.Fallback>
					</Avatar.Root>
					<h3 class="text-[15px] font-bold">{article.author.alias}</h3>
				</div>
				<Button variant="ghost" size="sm" href={articleLink + '/comments'}>{commentsText}</Button>
			</div>
		</div>
	</div>
</a>
