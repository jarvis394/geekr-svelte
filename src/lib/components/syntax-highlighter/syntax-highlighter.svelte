<script lang="ts">
	import { highlightCode } from './highlight'
	import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
	import { onMount } from 'svelte'
	import { StyleModule } from 'style-mod'
	import type { HighlightStyle } from '@codemirror/language'
	import escape from 'escape-html'

	export type HighlighterProps = {
		code: string
		language?: string
		theme?: HighlightStyle
	}

	const { language, code, theme = oneDarkHighlightStyle }: HighlighterProps = $props()
	const escapedCode = $derived(escape(code))

	onMount(() => {
		if (theme.module) {
			StyleModule.mount(document, theme.module)
		}
	})
</script>

<div
	class="SyntaxHighlighter not-prose bg-accent relative rounded-xl p-1 text-sm inset-ring inset-ring-black/7 in-[.article]:my-3 dark:bg-white/3 dark:inset-ring-white/7"
>
	<div
		class="*:bg-background! inset-ring-black/7 *:flex *:*:max-w-none *:*:shrink-0 *:*:grow *:overflow-auto *:rounded-lg *:p-5 *:inset-ring *:inset-ring-black/7 dark:*:bg-white/3! dark:*:inset-ring-white/3"
	>
		{#await highlightCode(language || 'plaintext', code, theme)}
			<pre><code>{@html escapedCode}</code></pre>
		{:then highlighedCode}
			<pre><code>{@html highlighedCode}</code></pre>
		{/await}
	</div>
</div>
