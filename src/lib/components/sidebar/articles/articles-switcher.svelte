<script lang="ts">
	import { ArticlesSwitcher } from '$lib/components/articles-switcher'
	import type { GetArticlesParamsData } from '$lib/utils'
	import { page } from '$app/state'

	const articleParams = $derived(page.data?.articleParams) as GetArticlesParamsData | undefined
</script>

{#if articleParams}
	<div class="inset-ring-border rounded-2xl pb-4 inset-ring">
		<ArticlesSwitcher {articleParams} applyOnClick variant="desktop" />
	</div>
{/if}
