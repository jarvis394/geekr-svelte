<script lang="ts">
	import type { PageProps } from './$types'
	import { ArticleCommentsLayout } from '$lib/pages/article-comments'

	const props: PageProps = $props()
</script>

<ArticleCommentsLayout {...props} />
