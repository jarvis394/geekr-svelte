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
	import { cn, getArticleLeadImage } from '$lib/utils'

	const ARTICLE_ITEM_IMAGE_HEIGHT = 212
	const MAX_PREVIEW_TEXT_LENGTH = 600
	const { class: containerClasses, article, ...other }: ArticleItemProps = $props()

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
	const leadImage = $derived(getArticleLeadImage(article))
	const complexityLabel = $derived.by(() => {
		if (article.complexity === 'low') {
			return 'Лёгкий'
		} else if (article.complexity === 'medium') {
			return 'Средний'
		} else if (article.complexity === 'high') {
			return 'Сложный'
		}
		return ''
	})
	const complexityColor = $derived.by(() => {
		if (article.complexity === 'low') {
			return 'text-emerald-600 dark:text-emerald-400'
		} else if (article.complexity === 'medium') {
			return 'text-blue-600 dark:text-blue-400'
		} else if (article.complexity === 'high') {
			return 'text-red-600 dark:text-red-400'
		}
		return ''
	})
	const gaugePointerPath = $derived.by(() => {
		if (article.complexity === 'low') {
			return '-4-4'
		} else if (article.complexity === 'medium') {
			return '0-5'
		} else if (article.complexity === 'high') {
			return '4-4'
		}
		return '0-5'
	})
</script>

<div
	{...other}
	class={cn(
		'animate-in fade-in border-border relative flex flex-col border-b-[1px]',
		containerClasses
	)}
>
	<ArticleLabels
		{article}
		data-float={!!leadImage}
		class="z-10 p-2 pb-0 data-[float='false']:p-3 data-[float='false']:pb-0 data-[float='true']:absolute"
	/>
	{#if leadImage}
		<a
			href={articleLink}
			title={titlePlaintext}
			class="ArticleItem__image ring-default relative flex"
		>
			<Image
				disableZoom
				containerProps={{
					class: 'w-full rounded-none object-cover',
					style: 'height: ' + ARTICLE_ITEM_IMAGE_HEIGHT + 'px'
				}}
				width={'100%'}
				height={ARTICLE_ITEM_IMAGE_HEIGHT}
				class="min-h-full min-w-full object-cover"
				src={leadImage}
				alt={titlePlaintext}
			/>
			<md-ripple></md-ripple>
		</a>
	{/if}
	<div class="flex flex-col">
		<a
			href={articleLink}
			title={titlePlaintext}
			class:pt-2={!leadImage}
			class="ring-default flex flex-col gap-1 p-3 pb-0"
		>
			<div
				class="font-heading text-muted-foreground dark:text-hint flex flex-row flex-wrap gap-1.5 gap-y-0.5 text-sm font-medium"
			>
				{timestampText}<span>•</span>{viewsText}
				{#if article.complexity}
					<span>•</span>
					<div class={cn('flex items-center gap-1', complexityColor)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-gauge mb-[1px]"
						>
							<path d={`m12 14 ${gaugePointerPath}`} />
							<path d="M3.34 19a10 10 0 1 1 17.32 0" />
						</svg>
						{complexityLabel}
					</div>
				{/if}
			</div>
			<h2 class="font-heading text-primary text-xl font-bold">
				{titlePlaintext}
			</h2>
			<p class="text-muted-foreground line-clamp-7 text-[15px]/5">
				{parsedPreviewText}
			</p>
			<md-ripple></md-ripple>
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
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.03), transparent);
	}

	:global(.dark .ArticleItem__image::after) {
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.07), transparent);
	}
</style>
