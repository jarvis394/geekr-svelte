<script lang="ts">
	import type { ArticleLabel } from '$lib/types'
	import { Badge } from '../ui/badge'

	export type PostLabelProps = { data: ArticleLabel }

	const { data }: PostLabelProps = $props()
</script>

{#if data.type === 'sandbox'}
	<Badge class="text-primary-foreground/85 bg-[#E9E9E9]">{data.title}</Badge>
{:else if data.type === 'translation'}
	<Badge class="bg-sky-700 text-sky-50">{data.title}</Badge>
{:else if data.type === 'tutorial'}
	<Badge class="bg-indigo-500 text-indigo-50">{data.title}</Badge>
{:else if data.type === 'recovery'}
	<Badge class="bg-orange-500 text-orange-50">{data.title}</Badge>
{:else if data.type.startsWith('technotext')}
	<Badge class="bg-indigo-500 text-indigo-50">{data.title}</Badge>
{:else}
	<Badge class="text-primary-foreground/85 bg-[#E9E9E9]">{data.title}</Badge>
{/if}
