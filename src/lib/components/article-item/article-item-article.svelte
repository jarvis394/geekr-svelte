<script lang="ts">
	import { Avatar } from '$lib/components/ui/avatar'
	import { Button } from '../ui/button'
	import {
		ARTICLE_ITEM_IMAGE_HEIGHT,
		useArticleItem,
		type ArticleItemProps
	} from './article-item.svelte'
	import Image from '../image/image.svelte'
	import MessageSquare from '@lucide/svelte/icons/message-square'
	import ArticleLabels from '../article-labels/article-labels.svelte'
	import { cn } from '$lib/utils'
	import { ComplexityGauge } from '../complexity-gauge'
	import { browser } from '$app/environment'
	import { Bookmark } from '@lucide/svelte'
	import IntersectionObserver from 'svelte-intersection-observer'

	const { class: containerClasses, article, ...other }: ArticleItemProps = $props()
	const {
		titlePlaintext,
		timestampText,
		parsedPreviewText,
		leadImage,
		viewsText,
		articleLink,
		commentsText
	} = $derived(useArticleItem(article))
	let leadImageLoaded = $state(!browser)
	let element = $state<HTMLElement | null>(null)
	let intersecting = $state(false)
</script>

<IntersectionObserver {element} bind:intersecting>
	<div
		{...other}
		bind:this={element}
		class={cn(
			'border-border relative flex flex-col overflow-hidden border-b-[1px] pt-3 min-lg:first:pt-0',
			{ 'pt-0': leadImage },
			containerClasses
		)}
	>
		<ArticleLabels
			{article}
			class={cn('pointer-events-none z-10 p-2 pr-12', {
				'absolute pt-2': leadImage,
				'p-3 py-0': !leadImage
			})}
		/>
		<Button
			variant="ghost"
			size="icon"
			class="absolute top-0 right-0 z-20 size-12 rounded-full text-white/63"
		>
			<Bookmark class="size-6 drop-shadow-sm drop-shadow-black/63" />
		</Button>
		{#if leadImage}
			<a href={articleLink} title={titlePlaintext} class="ring-default relative flex">
				<Image
					disableZoom
					containerProps={{
						class: 'ArticleItem__image w-full rounded-none object-cover',
						style: `--imageHeight: ${ARTICLE_ITEM_IMAGE_HEIGHT}px;`
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
						style={`--imageHeight: ${ARTICLE_ITEM_IMAGE_HEIGHT}px;` +
							(intersecting ? '' : 'display: none;')}
						class="ArticleItem__imageBlur pointer-events-none absolute inset-0 -z-10 h-full w-full scale-105 blur-2xl brightness-250 contrast-100 saturate-125 duration-500 select-none"
					/>
				{/if}
				<md-ripple></md-ripple>
			</a>
		{/if}
		<div class="flex flex-col select-none">
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
						<ComplexityGauge class="fade-in animate-in" withLabel complexity={article.complexity} />
					{/if}
				</div>
				<h2 class="font-heading text-primary text-xl font-bold text-pretty">
					{titlePlaintext}
				</h2>
				<p class="text-muted-foreground line-clamp-7 text-[15px]/5">
					{parsedPreviewText}
				</p>
				<md-ripple></md-ripple>
			</a>
			<div class="ArticleItem__bottomBar flex items-center justify-between p-1.5 pt-1.5 pb-2">
				<Button variant="ghost" size="sm" class="pl-1.5">
					<Avatar
						class="size-6"
						hash={article.author.alias}
						src={article.author.avatarUrl}
						alt={'@' + article.author.alias}
					/>
					<h3 class="font-heading text-[15px] font-medium">{article.author.alias}</h3>
				</Button>

				<div class="flex">
					<Button
						variant="ghost"
						size="sm"
						href={articleLink + '/comments'}
						class="text-muted-foreground text-[15px]"
					>
						<MessageSquare class="mt-0.5" strokeWidth={2.5} />
						<span class="inline-flex gap-1">
							{article.statistics.commentsCount}
							<span class="xs:block hidden">{commentsText}</span>
							{#if article.relatedData?.unreadCommentsCount}
								<span
									class="text-secondary-foreground/90 bg-secondary flex items-center rounded-full px-1.75 text-xs font-bold"
								>
									+{article.relatedData.unreadCommentsCount}
								</span>
							{/if}
						</span>
					</Button>
				</div>
			</div>
		</div>
	</div>
</IntersectionObserver>

<style>
	.ArticleItem__bottomBar {
		height: 50px;
		content-visibility: auto;
		contain-intrinsic-size: 1px 50px;
	}

	:global(.ArticleItem__image) {
		transform: translateZ(0);
		height: var(--imageHeight);
		content-visibility: auto;
		contain-intrinsic-size: 1px var(--imageHeight);
	}

	:global(.ArticleItem__image)::after {
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
		height: var(--imageHeight);
		content-visibility: auto;
		contain-intrinsic-size: 1px var(--imageHeight);
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
