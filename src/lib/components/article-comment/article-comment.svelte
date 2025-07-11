<script lang="ts">
	import type { Comment, CommentBranch } from '$lib/types'
	import TextFormatter from '../text-formatter/text-formatter.svelte'
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import { Avatar } from '../ui/avatar'
	import { Button } from '../ui/button'
	import dayjs from 'dayjs'
	import ChevronUp from '@lucide/svelte/icons/chevron-up'
	import ChevronDown from '@lucide/svelte/icons/chevron-down'
	import { ScoreBadge } from '../score-badge'

	type ArticleCommentProps = {
		comment: Comment
		highlighted?: boolean
		collapsedRoot?: { collapsedAmount: number }
		expandBranch?: (comment: Comment) => void
		onBranchClick?: (branch: CommentBranch) => void
		highlightBranch?: (branch: CommentBranch) => void
		resetBranchHighlight?: (branch: CommentBranch) => void
	} & HTMLAttributes<HTMLElement>
	const {
		comment,
		highlighted,
		collapsedRoot,
		expandBranch,
		onBranchClick,
		highlightBranch,
		resetBranchHighlight,
		class: containerClasses,
		...other
	}: ArticleCommentProps = $props()
	const isThread = $derived(comment.level === 0)

	const handleBranchClick = (branch: CommentBranch) => {
		onBranchClick?.(branch)
	}

	const handleBranchHover = (branch: CommentBranch) => {
		highlightBranch?.(branch)
	}

	const handleBranchResetHighlight = (branch: CommentBranch) => {
		resetBranchHighlight?.(branch)
	}

	const handleExpandBranch = (comment: Comment) => {
		expandBranch?.(comment)
	}
</script>

<section
	{...other}
	data-comment-id={comment.id}
	class={cn('relative flex grow flex-row', containerClasses, {
		'pl-4': !isThread,
		'border-border border-b-1': comment.isLastInThread,
		'animate-highlight': highlighted,
		hidden: comment.isCollapsed
	})}
>
	{#each comment.branches || [] as branch}
		<button
			class="ArticleComment__branch focus-ring tap-highlight border-border hover:border-accent-foreground flex w-5 shrink-0 cursor-pointer flex-row border-l-1 hover:border-l-2"
			aria-label="Comment branch toggle"
			onclick={handleBranchClick.bind(null, branch)}
			onmouseenter={handleBranchHover.bind(null, branch)}
			onmouseleave={handleBranchResetHighlight.bind(null, branch)}
			data-comment-branch-for={branch.parentId}
		></button>
	{/each}
	<article
		class={cn('ArticleComment flex w-full flex-col pt-4 pr-4 pb-3', {
			'pl-4': isThread,
			'pt-3': !comment.author
		})}
	>
		{#if comment.author}
			<header
				tabindex="-1"
				class={cn(
					'ArticleComment__header focus:inset-ring-accent -m-1 mb-1 flex flex-row items-center gap-2 rounded-sm p-1 focus:inset-ring',
					{
						'bg-lime-100 focus:inset-ring focus:inset-ring-lime-600 dark:bg-lime-950':
							comment.isPostAuthor
					}
				)}
			>
				<Avatar
					hash={comment.author.alias}
					src={comment.author.avatarUrl}
					alt={'@' + comment.author.alias}
					class="size-6"
				/>
				<div class="flex flex-col gap-0.5">
					<h3 class="font-heading text-[13px] leading-none font-medium">
						{comment.author.alias}
					</h3>
					<p class="font-heading text-muted-foreground text-[10px] leading-none">
						{dayjs(comment.timePublished).fromNow()}
					</p>
				</div>
			</header>
			<!-- <TextFormatter
				class="text-[16px] leading-[1.6rem] *:first:mt-0 *:last:mb-0"
				html={comment.message}
			/> -->
			<div class="text-[16px] leading-[1.6rem] *:first:mt-0 *:last:mb-0">
				{@html comment.message}
			</div>
			<div class="mt-1.5 flex flex-row items-center justify-between">
				<Button variant="ghost" size="sm">Ответить</Button>
				<div class="flex items-center justify-center gap-1">
					<Button variant="ghost" class="text-muted-foreground h-9 w-9">
						<ChevronUp strokeWidth={3} />
					</Button>
					<ScoreBadge variant="dimmed" score={comment.score} />
					<Button variant="ghost" class="text-muted-foreground h-9 w-9">
						<ChevronDown strokeWidth={3} />
					</Button>
				</div>
			</div>
		{:else}
			<TextFormatter html="НЛО прилетело здесь" />
		{/if}
		{#if collapsedRoot}
			<Button variant="ghost" size="lg" onclick={handleExpandBranch.bind(null, comment)}>
				Раскрыть ветку ({collapsedRoot.collapsedAmount})
			</Button>
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

	.ArticleComment {
		content-visibility: auto;
	}
</style>
