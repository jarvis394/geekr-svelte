<script lang="ts">
	import { Html, isTag, type Element, type ProcessNode, type Text } from 'html-svelte-parser'
	import { Image } from '../image'
	import { cn } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'
	import formatLink from '$lib/utils/formatLink'
	import { SyntaxHighlighter } from '../syntax-highlighter'

	interface IframeResizeData {
		type: string
		id: number
		height: number
	}

	type TextFormatterProps = {
		html: string
		disableImageZoom?: boolean
	} & HTMLAttributes<HTMLDivElement>
	const {
		html: propsHTML,
		disableImageZoom,
		class: containerClasses,
		...other
	}: TextFormatterProps = $props()

	// Removes unnecessary <div> placed by Habr editor
	const divRegexp = /<div[^>]+xmlns="http:\/\/www\.w3\.org\/1999\/xhtml">([\s\S]*)<\/div>$/g
	const html = $derived(divRegexp.exec(propsHTML)?.[1] || propsHTML)
	const iframeHeights = $state<Record<string, number | string>>({})
	const hasIframe = $derived(html.search('<iframe'))

	const processNode = (node: Element | Text) => {
		if (!isTag(node)) return

		if (node.name === 'p' && node.children.length === 0) {
			return false
		}

		if (node.name === 'iframe') {
			node.attribs.src = node.attribs['data-src'] || node.attribs.src
			node.attribs.class = cn(node.attribs.class, 'w-full')
			node.attribs.height = iframeHeights[node.attribs.id]?.toString() || 'auto'
			node.attribs.frameborder = '0'
			node.attribs.allowfullscreen = 'true'
			return
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

			node.attribs.href = formattedLink || '#'
			node.attribs.target = formattedLink ? node.attribs.target : '_blank'
			node.attribs.class = cn(node.attribs.class, 'link')
			return
		}

		if (node.name === 'img') {
			const { 'data-src': dataSrc, src: possiblePlaceholderSrc, ...otherImageProps } = node.attribs
			const hasPlaceholder = !!dataSrc && dataSrc !== possiblePlaceholderSrc

			return {
				component: Image,
				props: {
					...otherImageProps,
					src: dataSrc || possiblePlaceholderSrc,
					placeholderSrc: hasPlaceholder ? possiblePlaceholderSrc : undefined,
					disableZoom: disableImageZoom
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
