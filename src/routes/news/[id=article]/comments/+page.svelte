<script lang="ts">
	import type { PageProps } from './$types'
	import { ArticleCommentsLayout, commentsSnapshot } from '$lib/pages/article-comments'

	const props: PageProps = $props()

	// Must be exported from the instance script: SvelteKit reads it from the component instance
	export const snapshot = commentsSnapshot
</script>

<ArticleCommentsLayout {...props} />
