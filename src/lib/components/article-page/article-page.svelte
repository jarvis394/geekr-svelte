<script lang="ts">
	import type { Article } from '$lib/types'
	import { Button } from '$lib/components/ui/button'
	import ArrowLeft from 'lucide-svelte/icons/arrow-left'
	import TextFormatter from '../text-formatter/text-formatter.svelte'

	type ArticlePageProps = { article: Article }
	const { article }: ArticlePageProps = $props()
</script>

<div class="flex flex-col gap-4 p-4">
	<div class="flex gap-2">
		<Button onclick={() => history.back()} size="sm" variant="outline">
			<ArrowLeft />Back
		</Button>
		<Button href={location.pathname + '/comments'} size="sm">Comments</Button>
	</div>
	<div
		class="prose prose-zinc dark:prose-invert prose-pre:border-[1px] animate-in fade-in break-words"
	>
		<h1>{@html article.titleHtml}</h1>
		<TextFormatter html={article.textHtml} />
	</div>
</div>
