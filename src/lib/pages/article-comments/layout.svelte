<script lang="ts">
	import { ArticleCommentsPage } from '$lib/pages/article-comments'
	import { Header } from '$lib/components/header'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from '../../../routes/articles/[id=article]/comments/$types'

	const { data }: PageProps = $props()
	let comments = $state(data.cachedComments)

	$effect(() => {
		void data.comments.then((res) => {
			if (JSON.stringify(res) === JSON.stringify(comments)) {
				return
			}

			comments = res
		})
	})
</script>

<svelte:head>
	<title>Статья / geekr.</title>
</svelte:head>
<div class="flex h-full w-full flex-col">
	<Header title="Комментарии" />
	{#if comments}
		<ArticleCommentsPage {comments} />
	{:else}
		<div class="relative h-[50000px] w-full">
			<div class="sticky top-12 flex w-full items-center justify-center py-16">
				<LoaderCircle class="animate-spin" />
			</div>
		</div>
	{/if}
</div>
