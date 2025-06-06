import type { CanvasRenderingContext2D } from '@napi-rs/canvas'

interface WrapTextProps {
	context: CanvasRenderingContext2D
	text: string
	x: number
	y: number
	maxWidth: number
	lineHeight: number
	backgroundColor: string
	textColor: string
}

export const wrapText = ({
	context,
	text = '',
	x,
	y,
	maxWidth,
	lineHeight,
	backgroundColor,
	textColor
}: WrapTextProps) => {
	const words = text.split(' ')
	const lines = []
	let line = ''

	while (words.length > 0) {
		let split = false
		while (context.measureText(words[0]).width >= maxWidth) {
			const tmp = words[0]
			words[0] = tmp.slice(0, -1)
			if (!split) {
				split = true
				words.splice(1, 0, tmp.slice(-1))
			} else {
				words[1] = tmp.slice(-1) + words[1]
			}
		}
		if (context.measureText(line + words[0]).width < maxWidth) {
			line += words.shift() + ' '
		} else {
			lines.push(line)
			line = ''
		}
		if (words.length === 0) {
			lines.push(line)
		}
	}

	y = y - (lines.length * lineHeight) / 2 + 40
	lines.forEach((e, i) => {
		const width = context.measureText(e)
		context.fillStyle = backgroundColor
		context.fillRect(x, y + 8 - lineHeight, width.width + 24, lineHeight + 16)
		context.fillStyle = textColor
		context.fillText(e, x + 16, i != 0 ? y - 8 : y)
		y += lineHeight + 16
	})
}
