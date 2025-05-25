<script lang="ts">
	import TextFormatter from '../text-formatter/text-formatter.svelte'
	import { Badge } from '../ui/badge'
	import type { ArticleItemProps } from './article-item.svelte'

	const { article, ...other }: ArticleItemProps = $props()
</script>

<div {...other} class="border-border flex flex-col border-b-[1px]">
	<div class="flex flex-wrap gap-2 p-3 pb-0">
		<Badge color="white">Записка от Habr</Badge>
	</div>
	<div class="p-3 pt-2">
		<TextFormatter html={article.leadData?.textHtml || ''} />
	</div>
</div>
