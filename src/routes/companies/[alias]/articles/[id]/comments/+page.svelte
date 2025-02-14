<script lang="ts">
	import { ArticleComment } from '$lib/components/article-comment'
	import { Header } from '$lib/components/header'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import ArticleCommentsPage from '$lib/components/article-comments-page/article-comments-page.svelte'
	const { data }: PageProps = $props()
</script>

<div class="flex flex-col">
	{#await data.comments}
		<Header />
		<div class="relative h-[10000px] w-full">
			<div class="sticky top-12 flex w-full items-center justify-center py-16">
				<LoaderCircle class="animate-spin" />
			</div>
		</div>
	{:then comments}
		<ArticleCommentsPage {comments} />
	{/await}
</div>
