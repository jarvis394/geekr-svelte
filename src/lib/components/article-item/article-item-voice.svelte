<script lang="ts">
	import TextFormatter from '../text-formatter/text-formatter.svelte'
	import type { ArticleItemProps } from './article-item.svelte'

	const { article, ...other }: ArticleItemProps = $props()
</script>

<div {...other} class="animate-in fade-in border-border flex flex-col gap-1.5 border-b-[1px] p-3">
	<TextFormatter html={article.leadData.textHtml} />
</div>
