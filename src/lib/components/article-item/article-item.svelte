<script lang="ts">
	import type { Article } from '$lib/types'
	import type { HTMLAttributes } from 'svelte/elements'
	import ArticleItemPost from './article-item-post.svelte'
	import ArticleItemPostExpanded from './article-item-post-expanded.svelte'
	import ArticleItemVoice from './article-item-voice.svelte'

	export type ArticleItemProps = { article: Article } & HTMLAttributes<HTMLDivElement>
	const { article, ...other }: ArticleItemProps = $props()

	// TODO: get value from user settings
	const expandArticleItems = false
</script>

{#if article.publicationType === 'voice'}
	<ArticleItemVoice {article} {...other} />
{:else if expandArticleItems}
	<ArticleItemPostExpanded {article} {...other} />
{:else}
	<ArticleItemPost {article} {...other} />
{/if}
