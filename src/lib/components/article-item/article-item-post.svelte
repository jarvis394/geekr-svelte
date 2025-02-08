<script lang="ts">
	import formatNumber from '$lib/utils/formatNumber'
	import getArticleLink from '$lib/utils/getArticleLink'
	import parsePreviewTextHtml from '$lib/utils/parsePreviewTextHTML'
	import dayjs from 'dayjs'
	import * as Avatar from '$lib/components/ui/avatar'
	import { Button } from '../ui/button'
	import type { ArticleItemProps } from './article-item.svelte'
	import Image from '../image/image.svelte'
	import MessageSquare from 'lucide-svelte/icons/message-square'
	import formatWordByNumber from '$lib/utils/formatWordByNumber'
	import ArticleLabels from '../article-labels/article-labels.svelte'
	import { cn } from '$lib/utils'

	const MAX_PREVIEW_TEXT_LENGTH = 600
	const { article, ...other }: ArticleItemProps = $props()

	const titlePlaintext = $derived(parsePreviewTextHtml(article.titleHtml))
	const parsedPreviewText = $derived(
		parsePreviewTextHtml(article.leadData.textHtml).slice(0, MAX_PREVIEW_TEXT_LENGTH)
	)
	const articleLink = $derived(getArticleLink(article))
	const timestampText = $derived(dayjs(article.timePublished).calendar())
	const viewsText = $derived(
		formatNumber(article.statistics.readingCount, ['просмотр', 'просмотра', 'просмотров'])
	)
	const commentsText = $derived(
		formatWordByNumber(article.statistics.commentsCount, [
			'комментарий',
			'комментария',
			'комментариев'
		])
	)
	const leadImage = $derived(article.leadImage || article.leadData.imageUrl)
</script>

<div {...other} class="animate-in fade-in border-border relative flex flex-col border-b-[1px]">
	<ArticleLabels
		{article}
		data-float={!!leadImage}
		class="z-10 p-2 pb-0 data-[float='false']:p-3 data-[float='false']:pb-0 data-[float='true']:absolute"
	/>
	{#if leadImage}
		<a
			href={articleLink}
			title={titlePlaintext}
			class="ArticleItem__image ring-default tap-highlight relative flex"
		>
			<Image
				containerProps={{
					class: 'h-[212px] w-full [&_img]:w-full rounded-none object-cover'
				}}
				src={leadImage}
				alt={titlePlaintext}
			/>
		</a>
	{/if}
	<div class="flex flex-col">
		<a
			href={articleLink}
			title={titlePlaintext}
			class:pt-2={!leadImage}
			class="ring-default tap-highlight flex flex-col gap-1 p-3 pb-0"
		>
			<div class="font-heading text-hint flex flex-row gap-1.5 text-[13px]/[17px] font-medium">
				{timestampText}<span>•</span>{viewsText}
			</div>
			<h2 class="font-heading text-primary text-xl font-bold">
				{titlePlaintext}
			</h2>
			<p class="text-muted-foreground line-clamp-7 text-[15px]/5">{parsedPreviewText}</p>
		</a>
		<div class="flex items-center justify-between p-1.5 pt-1.5 pb-2">
			<Button variant="ghost" size="sm" class="pl-1.5">
				<Avatar.Root class="h-6 w-6">
					<Avatar.Image
						hash={article.author.alias}
						src={article.author.avatarUrl}
						alt={'@' + article.author.alias}
					/>
					<Avatar.Fallback />
				</Avatar.Root>
				<h3 class="font-heading text-[15px] font-medium">{article.author.alias}</h3>
			</Button>

			<Button
				variant="ghost"
				size="sm"
				href={articleLink + '/comments'}
				class="text-muted-foreground text-[15px]"
			>
				<span class="mt-0.5">
					<MessageSquare strokeWidth={2.5} />
				</span>
				<span class="inline-flex gap-1">
					{article.statistics.commentsCount}
					<span class="xs:block hidden">{commentsText}</span>
				</span>
			</Button>
		</div>
	</div>
</div>

<style>
	.ArticleItem__image::after {
		content: '';
		position: absolute;
		width: 100%;
		top: 0;
		height: 48px;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.16), transparent);
	}
</style>
