<script lang="ts">
	import { ArticleCommentsPage } from '$lib/pages/article-comments'
	import { Header } from '$lib/components/header'
	import LoaderCircle from '@lucide/svelte/icons/loader-circle'
	import type { PageProps } from '../../../routes/articles/[id=article]/comments/$types'

	const { data }: PageProps = $props()
	let comments = $derived.by(() => {
		if (data.comments && !('then' in data.comments)) {
			return data.comments
		}

		return data.cachedComments
	})

	$effect(() => {
		Promise.resolve(data.comments).then((res) => {
			if (!res || JSON.stringify(res) === JSON.stringify(comments)) {
				return
			}

			comments = res
		})
	})
</script>

<svelte:head>
	<title>Комментарии / geekr.</title>
</svelte:head>
<div class="flex h-full w-full flex-col">
	<Header title="Комментарии" />
	{#await data.comments.promise}
		<div class="relative h-[1000000px] w-full">
			<div class="sticky top-12 flex w-full items-center justify-center py-16">
				<LoaderCircle class="animate-spin" />
			</div>
		</div>
	{:then comments}
		<ArticleCommentsPage {comments} />
	{:catch}
		error
	{/await}
</div>
