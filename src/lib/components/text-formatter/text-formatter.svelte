<script lang="ts">
	import { type Element, Html, isTag, type ProcessNode, type Text } from 'html-svelte-parser'
	import { Image } from '../image'
	import { Link } from '../link'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'
	import formatLink from '$lib/utils/formatLink'

	type TextFormatterProps = { html: string } & HTMLAttributes<HTMLDivElement>
	const { html: propsHTML, class: containerClasses, ...other }: TextFormatterProps = $props()

	// Removes unnecessary <div> placed by Habr editor
	const divRegexp = /<div[^>]+xmlns="http:\/\/www\.w3\.org\/1999\/xhtml">([\s\S]*)<\/div>$/g
	const html = $derived(divRegexp.exec(propsHTML)?.[1] || propsHTML)

	const processNode = (node: Element | Text) => {
		if (!isTag(node)) return

		if (node.name === 'a') {
			const formattedLink = formatLink(node.attribs.href)
			return {
				component: Link,
				props: {
					...node.attribs,
					href: formattedLink || node.attribs.href,
					target: formattedLink ? node.attribs.target : '_blank'
				}
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
