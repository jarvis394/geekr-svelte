<script lang="ts">
	import type { Article } from '$lib/types'
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
