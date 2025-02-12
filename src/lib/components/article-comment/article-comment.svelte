<script lang="ts">
	import type { Comment, Comments } from '$lib/types'
	import TextFormatter from '../text-formatter/text-formatter.svelte'
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import * as Avatar from '../ui/avatar'
	import { Button } from '../ui/button'
	import { ArticleComment } from '.'
	import dayjs from 'dayjs'

	type ArticleCommentProps = {
		comment: Comment
		comments?: Comments['comments']
	} & HTMLAttributes<HTMLElement>
	const { comment, comments, class: containerClasses, ...other }: ArticleCommentProps = $props()
	const isThread = $derived(comment.level === 0)
	let element: HTMLElement | null = null
	let isCollapsed = $state(false)

	const handleBranchClick = () => {
		isCollapsed = true
		if (element) {
			window.scrollTo({
				top: element.offsetTop - 48,
				behavior: 'smooth'
			})
		}
	}

	const handleCollapsedClick = () => {
		isCollapsed = false
	}
</script>

<section
	{...other}
	bind:this={element}
	class={cn('relative mt-3 flex grow flex-col', containerClasses, {
		'border-border mt-0 border-b-1 pt-4 pb-3': isThread
	})}
>
	<article
		class={cn('flex flex-col pr-4', {
			'px-4': isThread
		})}
	>
		{#if comment.author}
			<div class="mb-2 flex flex-row gap-2">
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
			<TextFormatter class="*:first-of-type:mt-0 *:last-of-type:mb-0" html={comment.message} />
		{:else}
			<TextFormatter html={'НЛО прилетело здесь'} />
		{/if}
	</article>
	{#if isCollapsed}
		<Button onclick={handleCollapsedClick} variant="ghost" size="sm">Раскрыть ветку</Button>
	{/if}
	{#if !isCollapsed && comment.children.length !== 0 && comments}
		<div
			class={cn('flex', {
				'ml-3': isThread
			})}
		>
			<button
				class="border-border hover:border-accent-foreground mt-2 flex w-4 shrink-0 cursor-pointer flex-row border-l-1 hover:border-l-2"
				onclick={handleBranchClick}
				aria-label={`Comment branch toggle for ${comment.id}`}
			></button>
			<div class="flex min-w-0 flex-1 flex-col">
				{#each comment.children as childCommentId}
					{@const childComment = comments[childCommentId]}
					{#if childComment}
						<ArticleComment comment={childComment} {comments} />
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</section>
