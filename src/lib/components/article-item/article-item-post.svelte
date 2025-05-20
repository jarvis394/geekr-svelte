<script lang="ts">
	import formatNumber from '$lib/utils/formatNumber'
	import getArticleLink from '$lib/utils/getArticleLink'
	import parsePreviewTextHtml from '$lib/utils/parsePreviewTextHTML'
	import dayjs from 'dayjs'
	import * as Avatar from '$lib/components/ui/avatar'
	import { Button } from '../ui/button'
	import type { ArticleItemProps } from './article-item.svelte'
	import Image from '../image/image.svelte'
	import MessageSquare from '@lucide/svelte/icons/message-square'
	import formatWordByNumber from '$lib/utils/formatWordByNumber'
	import ArticleLabels from '../article-labels/article-labels.svelte'
	import { cn, getArticleLeadImage } from '$lib/utils'
	import { ComplexityGauge } from '../complexity-gauge'

	const ARTICLE_ITEM_IMAGE_HEIGHT = 212
	const MAX_PREVIEW_TEXT_LENGTH = 600
	const { class: containerClasses, article, ...other }: ArticleItemProps = $props()

	let leadImageLoaded = $state(false)
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
</script>

<div
	{...other}
	class={cn(
		'animate-in fade-in border-border relative flex flex-col overflow-hidden border-b-[1px] pt-3 min-lg:first:pt-0',
		{ 'pt-0': leadImage },
		containerClasses
	)}
>
	<ArticleLabels
		{article}
		class={cn('pointer-events-none z-10 p-2', {
			'absolute pt-2': leadImage,
			'p-3 py-0': !leadImage
		})}
	/>
	{#if leadImage}
		<a href={articleLink} title={titlePlaintext} class="ring-default relative flex">
			<Image
				disableZoom
				containerProps={{
					class: 'w-full rounded-none object-cover',
					style: 'height: ' + ARTICLE_ITEM_IMAGE_HEIGHT + 'px'
				}}
				width="100%"
				height={ARTICLE_ITEM_IMAGE_HEIGHT}
				class="min-h-full min-w-full cursor-pointer object-cover"
				src={leadImage}
				alt={titlePlaintext}
				bind:loaded={leadImageLoaded}
			/>
			{#if leadImageLoaded}
				<img
					src={leadImage}
					alt={titlePlaintext}
					aria-hidden="true"
					class="ArticleItem__imageBlur pointer-events-none absolute inset-0 -z-10 h-full w-full scale-105 blur-2xl brightness-250 contrast-100 saturate-125 duration-500 select-none"
				/>
			{/if}
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
				class="font-heading text-muted-foreground dark:text-hint -z-20 flex flex-row flex-wrap gap-1.5 gap-y-0.5 text-sm font-medium"
			>
				{timestampText}<span>•</span>{viewsText}
				{#if article.complexity}
					<span>•</span>
					<ComplexityGauge withLabel complexity={article.complexity} />
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
	.ArticleItem__image {
		transform: translateZ(0);
	}

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

	.ArticleItem__imageBlur {
		opacity: 0.24;
		transform: translateZ(0);
		animation: 1000ms cubic-bezier(0.4, 0, 0.2, 1) 0ms fadeIn backwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.24;
		}
	}
</style>
