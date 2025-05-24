<script lang="ts">
	import { ArticlesSwitcher } from '$lib/components/articles-switcher'
	import type { GetArticlesParamsData } from '$lib/utils'
	import { page } from '$app/state'

	const articlesParams = $derived(page.data?.articleParams) as GetArticlesParamsData | undefined
	const articlesMode = $derived(page.data?.articlesMode) as
		| 'articles'
		| 'posts'
		| 'news'
		| undefined
</script>

{#if articlesParams}
	<div class="inset-ring-border rounded-2xl pb-4 inset-ring">
		<ArticlesSwitcher {articlesParams} {articlesMode} applyOnClick variant="desktop" />
	</div>
{/if}
