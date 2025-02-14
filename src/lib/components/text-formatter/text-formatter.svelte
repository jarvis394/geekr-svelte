<script lang="ts">
	import { type Element, Html, isTag, type ProcessNode, type Text } from 'html-svelte-parser'
	import { Image } from '../image'
	import { Link } from '../link'
	import NoContent from './no-content.svelte'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'
	import formatLink from '$lib/utils/formatLink'
	import Iframe from './iframe.svelte'

	interface IframeResizeData {
		type: string
		id: number
		height: number
	}

	type TextFormatterProps = { html: string } & HTMLAttributes<HTMLDivElement>
	const { html: propsHTML, class: containerClasses, ...other }: TextFormatterProps = $props()

	// Removes unnecessary <div> placed by Habr editor
	const divRegexp = /<div[^>]+xmlns="http:\/\/www\.w3\.org\/1999\/xhtml">([\s\S]*)<\/div>$/g
	const html = $derived(divRegexp.exec(propsHTML)?.[1] || propsHTML)
	const iframeHeights = $state<Record<string, number | string>>({})

	const processNode = (node: Element | Text) => {
		if (!isTag(node)) return

		if (node.name === 'p' && node.children.length === 0) {
			return {
				component: NoContent
			}
		}

		if (node.name === 'iframe') {
			return {
				component: Iframe,
				props: {
					src: node.attribs['data-src'] || node.attribs.src,
					height: iframeHeights[node.attribs.id]?.toString() || 'auto',
					id: node.attribs.id
				}
			}
		}

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

	$effect(() => {
		const handler = (e: MessageEvent<IframeResizeData>) => {
			if (e.data.type === 'embed-size') {
				iframeHeights[e.data.id] = e.data.height || 'auto'
			}
		}

		window.addEventListener('message', handler)
		return () => {
			window.removeEventListener('message', handler)
		}
	})
</script>

<div {...other} class={cn('TextFormatter article', containerClasses)}>
	<Html {html} processNode={processNode as ProcessNode} />
</div>
