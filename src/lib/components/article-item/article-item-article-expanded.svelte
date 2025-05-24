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
	import { cn } from '$lib/utils'
	import TextFormatter from '../text-formatter/text-formatter.svelte'
	import { ComplexityGauge } from '../complexity-gauge'

	const { class: containerClasses, article, ...other }: ArticleItemProps = $props()

	const titlePlaintext = $derived(parsePreviewTextHtml(article.titleHtml))
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
</script>

<div
	{...other}
	class={cn(
		'animate-in fade-in border-border relative flex flex-col overflow-hidden border-b-[1px]',
		containerClasses
	)}
>
	<ArticleLabels {article} class="z-10 p-3 pb-2 min-lg:in-first:pt-0" />
	<div
		class="font-heading text-muted-foreground dark:text-hint -z-20 flex flex-row flex-wrap gap-1.5 gap-y-0.5 px-3 pb-1 text-sm font-medium"
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
		class="font-heading text-primary px-3 pb-1 text-xl font-bold"
	>
		{titlePlaintext}
	</a>
	{#if article.leadData?.image}
		<Image
			containerProps={{ class: 'mx-3 mb-4 mt-2' }}
			disableZoom
			src={article.leadData.image.url}
		/>
	{/if}
	<TextFormatter
		disableImageZoom
		class="px-3 text-base/[1.6]"
		html={article.leadData?.textHtml || ''}
	/>
	<div class="flex items-center justify-between px-3 pt-3 pb-2">
		<Button variant="ghost" size="sm" class="-ml-1.5 pl-1.5">
			<Avatar.Root class="h-6 w-6">
				<Avatar.Image
					hash={article.author.alias}
					src={article.author.avatarUrl}
					alt={'@' + article.author.alias}
				/>
			</Avatar.Root>
			<h3 class="font-heading text-[15px] font-medium">{article.author.alias}</h3>
		</Button>

		<div class="-mr-1.5 flex flex-row items-center gap-1">
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
			<Button variant="outline" size="sm" href={articleLink} class="text-[15px]">
				{@html article.leadData?.buttonTextHtml}
			</Button>
		</div>
	</div>
</div>
