<script lang="ts">
	import type { Comment, CommentBranch } from '$lib/types'
	import TextFormatter from '../text-formatter/text-formatter.svelte'
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import * as Avatar from '../ui/avatar'
	import { Button } from '../ui/button'
	import dayjs from 'dayjs'
	import { ArticleLabel } from '../article-label'

	type ArticleCommentProps = {
		comment: Comment
		onBranchClick: (branch: CommentBranch) => void
		highlightBranch: (branch: CommentBranch) => void
		resetBranchHighlight: (branch: CommentBranch) => void
	} & HTMLAttributes<HTMLElement>
	const {
		comment,
		onBranchClick,
		highlightBranch,
		resetBranchHighlight,
		class: containerClasses,
		...other
	}: ArticleCommentProps = $props()
	const isThread = $derived(comment.level === 0)

	const handleBranchClick = (branch: CommentBranch) => {
		onBranchClick(branch)
	}

	const handleBranchHover = (branch: CommentBranch) => {
		highlightBranch(branch)
	}

	const handleBranchReset = (branch: CommentBranch) => {
		resetBranchHighlight(branch)
	}
</script>

<section
	{...other}
	data-comment-id={comment.id}
	class={cn('relative flex grow flex-row', containerClasses, {
		'pl-4': !isThread,
		'border-border border-b-1': comment.isLastInThread
	})}
>
	{#each comment.branches || [] as branch}
		<button
			class="ArticleComment__branch border-border hover:border-accent-foreground flex w-5 shrink-0 cursor-pointer flex-row border-l-1 hover:border-l-2"
			aria-label={`Comment branch toggle`}
			onclick={handleBranchClick.bind(null, branch)}
			onmouseenter={handleBranchHover.bind(null, branch)}
			onmouseleave={handleBranchReset.bind(null, branch)}
			data-comment-branch-for={branch.parentId}
		></button>
	{/each}
	<article
		class={cn('flex w-full flex-col pt-4 pr-4 pb-3', {
			'pl-4': isThread
		})}
	>
		{#if comment.author}
			<div class="ArticleComment__header mb-2 flex flex-row gap-2">
				<Avatar.Root class="h-6 w-6">
					<Avatar.Image
						hash={comment.author.alias}
						src={comment.author.avatarUrl}
						alt={'@' + comment.author.alias}
					/>
					<Avatar.Fallback />
				</Avatar.Root>
				<h3 class="font-heading text-base font-medium">
					{comment.author.alias}
				</h3>
				<p class="font-heading text-muted-foreground text-base font-medium">
					{dayjs(comment.timePublished).format('DD.MM.YYYY [в] HH:mm')}
				</p>
			</div>
			<TextFormatter class="*:first:mt-0 *:last:mb-0" html={comment.message} />
			<div class="mt-1.5 flex flex-row items-center justify-between">
				<Button variant="ghost" size="sm">Ответить</Button>
				<ArticleLabel score={comment.score} />
			</div>
		{:else}
			<TextFormatter html={'НЛО прилетело здесь'} />
		{/if}
	</article>
</section>

<style>
	.ArticleComment__header {
		content-visibility: auto;
		contain-intrinsic-size: 1px 24px;
	}

	:global(.ArticleComment__branch--highlighted) {
		border-color: white;
		border-left-width: 2px;
	}
</style>
