<script lang="ts">
	import { Avatar } from '$lib/components/ui/avatar'
	import { Button } from '../ui/button'
	import { useArticleItem, type ArticleItemProps } from './article-item.svelte'
	import Image from '../image/image.svelte'
	import MessageSquare from '@lucide/svelte/icons/message-square'
	import ArticleLabels from '../article-labels/article-labels.svelte'
	import { cn } from '$lib/utils'
	import TextFormatter from '../text-formatter/text-formatter.svelte'
	import { ComplexityGauge } from '../complexity-gauge'
	import { Link } from '../link'
	import { Bookmark } from '@lucide/svelte'

	const { class: containerClasses, article, ...other }: ArticleItemProps = $props()
	const { titlePlaintext, timestampText, viewsText, articleLink, commentsText } = $derived(
		useArticleItem(article)
	)
	const leadImage = $derived(article.leadData?.image)
	// Have to sort hubs to prevent mismatch between
	// preview article hubs and full article hubs
	const sortedHubs = $derived.by(() => {
		const hubs = [...article.hubs]
		hubs.sort((a, b) => Number(a.id) - Number(b.id))
		return hubs
	})
</script>

<div
	{...other}
	class={cn(
		'border-border relative flex flex-col overflow-hidden border-b-[1px] p-3 pb-2 min-lg:first:pt-0',
		containerClasses
	)}
>
	<ArticleLabels {article} class="z-10 pr-12 pb-2" />
	<Button
		variant="ghost"
		size="icon"
		class="text-primary/63 absolute top-0 right-0 z-20 size-12 rounded-full"
	>
		<Bookmark class="drop-shadow-background/63 size-6 drop-shadow-sm" />
	</Button>
	<div
		class="font-heading text-muted-foreground dark:text-hint -z-20 flex flex-row flex-wrap gap-1.5 gap-y-0.5 pb-1 text-sm font-medium"
	>
		{timestampText}<span>•</span>{viewsText}
		{#if article.complexity}
			<span>•</span>
			<ComplexityGauge withLabel class="fade-in animate-in" complexity={article.complexity} />
		{/if}
	</div>
	<a
		title={titlePlaintext}
		href={articleLink}
		class="font-heading text-primary pb-1.5 text-xl font-bold text-pretty"
	>
		{titlePlaintext}
	</a>
	<div class="flex flex-wrap gap-1.5 pb-4">
		{#each sortedHubs as hub}
			<span class="ArticleItem__hub text-muted-foreground text-sm">
				<Link class="text-muted-foreground text-sm" href={'/hubs/' + hub.alias}>
					{hub.title}
				</Link>
			</span>
		{/each}
	</div>
	{#if article.leadData?.image}
		<Image
			containerProps={{
				class: 'mb-4 w-full relative pb-[56.4103%] items-start justify-start',
				style: `object-fit: ${leadImage?.fit || 'cover'}`
			}}
			style={`object-position: ${leadImage?.positionX + '%' || '0%'} ${leadImage?.positionY + '%' || '50%'}; object-fit: ${leadImage?.fit || 'cover'}`}
			disableZoom
			class="absolute h-full w-full"
			src={article.leadData.image.url}
		/>
	{/if}
	<TextFormatter disableImageZoom class="text-base/[1.6]" html={article.leadData?.textHtml || ''} />
	<div class="flex items-center justify-between pt-3">
		<Button variant="ghost" size="sm" class="-ml-1.5 pl-1.5">
			<Avatar
				class="size-6"
				hash={article.author.alias}
				src={article.author.avatarUrl}
				alt={'@' + article.author.alias}
			/>
			<h3 class="font-heading text-[15px] font-medium">{article.author.alias}</h3>
		</Button>

		<div class="-mr-1.5 flex flex-row items-center gap-1">
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
				</span>
			</Button>
			<Button variant="outline" size="sm" href={articleLink} class="text-[15px]">
				{@html article.leadData?.buttonTextHtml || 'Читать далее'}
			</Button>
		</div>
	</div>
</div>

<style>
	.ArticleItem__hub::after {
		content: ', ';
		z-index: 10;
		position: relative;
	}

	.ArticleItem__hub:last-child:after {
		content: '';
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
