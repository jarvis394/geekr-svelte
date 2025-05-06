<script lang="ts">
	import { type Element, Html, isTag, type ProcessNode, type Text } from 'html-svelte-parser'
	import { Image } from '../image'
	import { Link } from '../link'
	import NoContent from './no-content.svelte'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'
	import formatLink from '$lib/utils/formatLink'
	import Iframe from './iframe.svelte'
	import { SyntaxHighlighter } from '../syntax-highlighter'

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
	const hasIframe = $derived(html.search('<iframe'))

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

		if (node.name === 'pre') {
			const firstChild = node.firstChild
			const language = (firstChild?.type === 'tag' && firstChild?.attribs.class) || undefined

			let code = null

			if (
				firstChild?.type === 'tag' &&
				firstChild.firstChild &&
				firstChild.firstChild.type === 'text'
			) {
				code = firstChild.firstChild.data
			} else if (firstChild?.type === 'text') {
				code = firstChild.data
			}

			console.log(language, code)

			return {
				component: SyntaxHighlighter,
				props: {
					language,
					code
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
			const { 'data-src': dataSrc, src: possiblePlaceholderSrc, ...otherImageProps } = node.attribs
			const hasPlaceholder = !!dataSrc && dataSrc !== possiblePlaceholderSrc

			return {
				component: Image,
				props: {
					...otherImageProps,
					src: dataSrc || possiblePlaceholderSrc,
					placeholderSrc: hasPlaceholder ? possiblePlaceholderSrc : undefined
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

		if (!hasIframe) return

		window.addEventListener('message', handler)
		return () => {
			window.removeEventListener('message', handler)
		}
	})
</script>

<div {...other} class={cn('TextFormatter article', containerClasses)}>
	<Html {html} processNode={processNode as ProcessNode} />
</div>
