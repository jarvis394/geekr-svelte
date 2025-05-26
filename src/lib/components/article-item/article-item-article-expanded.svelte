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

	const { class: containerClasses, article, ...other }: ArticleItemProps = $props()
	const { titlePlaintext, timestampText, viewsText, articleLink, commentsText } = $derived(
		useArticleItem(article)
	)
</script>

<div
	{...other}
	class={cn(
		'border-border relative flex flex-col overflow-hidden border-b-[1px] p-3 pb-2 min-lg:first:pt-0',
		containerClasses
	)}
>
	<ArticleLabels {article} class="z-10 pb-2" />
	<div
		class="font-heading text-muted-foreground dark:text-hint -z-20 flex flex-row flex-wrap gap-1.5 gap-y-0.5 pb-2 text-sm font-medium"
	>
		{timestampText}<span>•</span>{viewsText}
		{#if article.complexity}
			<span>•</span>
			<ComplexityGauge withLabel complexity={article.complexity} />
		{/if}
	</div>
	<a
		title={titlePlaintext}
		href={articleLink}
		class="font-heading text-primary pb-4 text-xl font-bold text-pretty"
	>
		{titlePlaintext}
	</a>
	{#if article.leadData?.image}
		<Image containerProps={{ class: 'mb-4' }} disableZoom src={article.leadData.image.url} />
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
				{@html article.leadData?.buttonTextHtml}
			</Button>
		</div>
	</div>
</div>
