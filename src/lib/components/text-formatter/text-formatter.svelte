<script lang="ts">
	import { type Element, Html, isTag, type ProcessNode, type Text } from 'html-svelte-parser'
	import { Image } from '../image'
	import { Link } from '../link'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'

	type TextFormatterProps = { html: string } & HTMLAttributes<HTMLDivElement>
	const { html, class: containerClasses, ...other }: TextFormatterProps = $props()

	const processNode = (node: Element | Text) => {
		if (!isTag(node)) return

		if (node.name === 'a') {
			return {
				component: Link,
				props: { ...node.attribs, target: '_blank' }
			}
		}

		if (node.name === 'img') {
			const src = node.attribs['data-src']
			const placeholderSrc = node.attribs.src
			const hasPlaceholder = !!placeholderSrc && placeholderSrc !== src

			return {
				component: Image,
				props: {
					...node.attribs,
					src: src || placeholderSrc,
					placeholderSrc: hasPlaceholder ? placeholderSrc : undefined
				}
			}
		}

		return
	}
</script>

<div {...other} class={cn('TextFormatter article', containerClasses)}>
	<Html {html} processNode={processNode as ProcessNode} />
</div>
