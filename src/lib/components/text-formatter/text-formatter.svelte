<script lang="ts">
	import { type Element, Html, isTag, type ProcessNode, type Text } from 'html-svelte-parser'
	import { Image } from '../image'

	type TextFormatterProps = { html: string }
	const { html }: TextFormatterProps = $props()

	const processNode = (node: Element | Text) => {
		if (!isTag(node)) return

		if (node.attribs.xmlns === 'http://www.w3.org/1999/xhtml') {
			node.attribs.class = 'TextFormatter'
			return
		}

		if (node.name === 'img') {
			const src = node.attribs['data-src']
			const placeholderSrc = node.attribs.src
			const hasPlaceholder = !!placeholderSrc && placeholderSrc !== src
			return {
				component: Image,
				props: {
					width: node.attribs.width,
					height: node.attribs.height,
					src: src || placeholderSrc,
					placeholderSrc: hasPlaceholder ? placeholderSrc : undefined
				}
			}
		}

		return
	}
</script>

<Html {html} processNode={processNode as ProcessNode} />
