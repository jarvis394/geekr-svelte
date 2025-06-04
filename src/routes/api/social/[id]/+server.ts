import type { RequestHandler } from './$types'
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { wrapText } from '$lib/utils/canvas'
import path from 'node:path'
import { readFileSync } from 'node:fs'
import { error } from '@sveltejs/kit'
import * as api from '$lib/api'

const fontBuffer = readFileSync(
	path.resolve(path.join('static', 'fonts', 'GoogleSans', 'GoogleSans-Bold.ttf'))
)
GlobalFonts.register(fontBuffer)

const fontFamily = 'Google Sans'
const fontSizes = {
	logo: 64,
	title: 56,
	hub: 40
}
const theme = {
	fontStyles: {
		hub: `500 ${fontSizes.hub}px ${fontFamily}`,
		title: `700 ${fontSizes.title}px ${fontFamily}`,
		logo: `700 ${fontSizes.logo}px ${fontFamily}`
	},
	fontSizes: {
		logo: 80,
		title: 72,
		hub: 56
	},
	colors: {
		primary: '#82b1ff',
		text: 'white',
		background: '#080808'
	},
	spacing: 64
}

export const GET: RequestHandler = async ({ url, params, fetch }) => {
	const { id: unparsedId } = params
	const id = Number(unparsedId)

	if (isNaN(id)) return error(400, 'Invalid article ID')

	const article = await api.article.get({
		id,
		fetch
	})

	const title = article.titleHtml
	const hub = article.hubs[0].title

	const canvas = createCanvas(1200, 630)
	const ctx = canvas.getContext('2d')

	// Load images
	const logo = await loadImage(`${url.origin}/logo.svg`)
	const background = await loadImage(`${url.origin}/og_background.svg`)

	// Background
	ctx.fillStyle = theme.colors.background
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.drawImage(background, 0, 0)

	// Logo
	logo.width = 82
	logo.height = (logo.naturalHeight / logo.naturalWidth) * 82
	ctx.fillStyle = theme.colors.text
	ctx.drawImage(logo, canvas.width - theme.spacing - logo.width, theme.spacing - 28)

	// Header Title
	ctx.fillStyle = theme.colors.text
	ctx.font = theme.fontStyles.logo
	ctx.fillText('geekr.', theme.spacing, theme.spacing + theme.fontSizes.title / 2)

	// Article Title
	ctx.font = theme.fontStyles.title
	wrapText({
		context: ctx,
		text: title,
		x: theme.spacing,
		y: canvas.height / 2,
		maxWidth: canvas.width - theme.spacing * 2,
		lineHeight: theme.fontSizes.title,
		backgroundColor: theme.colors.primary,
		textColor: theme.colors.background
	})

	// Hub
	ctx.fillStyle = theme.colors.text
	ctx.font = theme.fontStyles.hub
	ctx.fillText(hub, theme.spacing, canvas.height - theme.spacing)

	return new Response(canvas.encodeStream('jpeg') as ReadableStream)
}
