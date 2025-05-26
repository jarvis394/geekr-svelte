<script lang="ts" module>
	import type { Article } from '$lib/types'
	import {
		parsePreviewTextHtml,
		getArticleLink,
		formatNumber,
		formatWordByNumber,
		getArticleLeadImage
	} from '$lib/utils'
	import dayjs from 'dayjs'

	export const ARTICLE_ITEM_IMAGE_HEIGHT = 212
	export const MAX_PREVIEW_TEXT_LENGTH = 600

	export const useArticleItem = (article: Article) => {
		const titlePlaintext = parsePreviewTextHtml(article.titleHtml)
		const articleLink = getArticleLink(article)
		const timestampText = dayjs(article.timePublished).calendar()
		const viewsText = formatNumber(article.statistics.readingCount, [
			'просмотр',
			'просмотра',
			'просмотров'
		])
		const commentsText = formatWordByNumber(article.statistics.commentsCount, [
			'комментарий',
			'комментария',
			'комментариев'
		])
		const leadImage = getArticleLeadImage(article)
		const parsedPreviewText = parsePreviewTextHtml(article.leadData?.textHtml || '').slice(
			0,
			MAX_PREVIEW_TEXT_LENGTH
		)

		return {
			titlePlaintext,
			articleLink,
			timestampText,
			viewsText,
			commentsText,
			leadImage,
			parsedPreviewText
		}
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import ArticleItemArticle from './article-item-article.svelte'
	import ArticleItemArticleExpanded from './article-item-article-expanded.svelte'
	import ArticleItemVoice from './article-item-voice.svelte'
	import ArticleItemPost from './article-item-post.svelte'

	export type ArticleItemProps = {
		article: Article
	} & HTMLAttributes<HTMLDivElement>
	const { article, ...other }: ArticleItemProps = $props()

	// TODO: get value from user settings
	const expandArticleItems = false
</script>

{#if article.publicationType === 'voice'}
	<ArticleItemVoice {article} {...other} />
{:else if article.publicationType === 'post'}
	<ArticleItemPost {article} {...other} />
{:else if expandArticleItems}
	<ArticleItemArticleExpanded {article} {...other} />
{:else}
	<ArticleItemArticle {article} {...other} />
{/if}
