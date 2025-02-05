<script lang="ts">
	import type { Article } from '$lib/types'
	import type { HTMLAttributes } from 'svelte/elements'
	import ArticleItemPost from './article-item-post.svelte'
	import ArticleItemVoice from './article-item-voice.svelte'

	export type ArticleItemProps = { article: Article } & HTMLAttributes<HTMLDivElement>
	const { article, ...other }: ArticleItemProps = $props()
</script>

{#if article.publicationType === 'voice'}
	<ArticleItemVoice {article} {...other} />
{:else}
	<ArticleItemPost {article} {...other} />
{/if}
