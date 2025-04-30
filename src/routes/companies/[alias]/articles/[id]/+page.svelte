<script lang="ts">
	import type { PageProps } from './$types'
	import { ArticleLayout } from '$lib/components/article-layout'

	const props: PageProps = $props()
</script>

<ArticleLayout {...props} />
