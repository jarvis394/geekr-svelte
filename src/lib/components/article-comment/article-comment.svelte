<script lang="ts">
	import type { Comment, CommentBranch } from '$lib/types'
	import TextFormatter from '../text-formatter/text-formatter.svelte'
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import * as Avatar from '../ui/avatar'
	import { Button } from '../ui/button'
	import dayjs from 'dayjs'
	import ScoreBadge, { type ScoreBadgeVariant } from './score-badge.svelte'
	import ChevronUp from 'lucide-svelte/icons/chevron-up'
	import ChevronDown from 'lucide-svelte/icons/chevron-down'

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
	const scoreBadgeVariant = $derived.by<ScoreBadgeVariant>(() => {
		if (comment.score === 0) return 'neutral'
		return comment.score > 0 ? 'positive' : 'negative'
	})

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
		'animate-highlight': highlighted
	})}
>
	{#each comment.branches || [] as branch}
		<button
			class="ArticleComment__branch tap-highlight border-border hover:border-accent-foreground flex w-5 shrink-0 cursor-pointer flex-row border-l-1 hover:border-l-2"
			aria-label={`Comment branch toggle`}
			onclick={handleBranchClick.bind(null, branch)}
			onmouseenter={handleBranchHover.bind(null, branch)}
			onmouseleave={handleBranchResetHighlight.bind(null, branch)}
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
				<div class="flex items-center justify-center gap-1">
					<Button variant="ghost" class="text-muted-foreground h-9 w-9"
						><ChevronUp strokeWidth={3} /></Button
					>
					<ScoreBadge variant={scoreBadgeVariant}>{comment.score}</ScoreBadge>
					<Button variant="ghost" class="text-muted-foreground h-9 w-9"
						><ChevronDown strokeWidth={3} /></Button
					>
				</div>
			</div>
		{:else}
			<TextFormatter html={'НЛО прилетело здесь'} />
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
</style>
