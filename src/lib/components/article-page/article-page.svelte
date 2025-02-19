<script lang="ts">
	import type { Article } from '$lib/types'
	import TextFormatter from '../text-formatter/text-formatter.svelte'
	import { ArticleLabels } from '../article-labels'
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import { Link } from '../link'
	import * as Avatar from '../ui/avatar'
	import dayjs from 'dayjs'
	import { Button } from '../ui/button'

	type ArticlePageProps = { article: Article } & HTMLAttributes<HTMLDivElement>
	const { article, class: containerClasses, ...other }: ArticlePageProps = $props()
	const timestampText = $derived(dayjs(article.timePublished).calendar().toLowerCase())
</script>

<svelte:head>
	<title>{article.titleHtml} / geekr.</title>
</svelte:head>
<div {...other} class={cn('animate-in fade-in flex flex-col gap-4 p-4', containerClasses)}>
	<div class="flex flex-col">
		<div class="flex flex-col gap-3">
			<div class="flex flex-row gap-2">
				<Avatar.Root class="h-6 w-6">
					<Avatar.Image
						hash={article.author.alias}
						src={article.author.avatarUrl}
						alt={'@' + article.author.alias}
					/>
					<Avatar.Fallback />
				</Avatar.Root>
				<h3 class="font-heading text-base font-medium">
					{article.author.alias}
				</h3>
				<p class="font-heading text-muted-foreground text-base font-medium">
					{timestampText}
				</p>
			</div>
			<h1 class="font-heading text-2xl font-bold">
				{@html article.titleHtml}
			</h1>
			<ArticleLabels {article} />
			<div class="flex flex-wrap gap-1.5">
				{#each article.hubs as hub}
					<span class="Article__hub text-muted-foreground text-sm">
						<Link class="text-muted-foreground text-sm" href={'/hubs/' + hub.alias}>
							{hub.title}
						</Link>
					</span>
				{/each}
			</div>
		</div>
		<TextFormatter
			class={article.editorVersion === '1.0' ? 'article--version-1 mt-6' : ''}
			html={article.textHtml}
		/>
	</div>
	<Button href={window.location.pathname + '/comments'} variant="ghost">Комментарии</Button>
</div>

<style>
	.Article__hub::after {
		content: ', ';
		z-index: 10;
		position: relative;
	}

	.Article__hub:last-child:after {
		content: '';
	}
</style>
