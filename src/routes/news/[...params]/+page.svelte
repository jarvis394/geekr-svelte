<script lang="ts">
	import type { PageProps } from './$types'
	import { ArticlesPage } from '$lib/pages/articles'

	const props: PageProps = $props()
</script>

<ArticlesPage {...props} />
