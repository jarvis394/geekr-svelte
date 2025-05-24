<script lang="ts">
	import type { PageProps } from './$types'
	import { ArticleLayout } from '$lib/pages/article'

	const props: PageProps = $props()
</script>

<ArticleLayout {...props} />
