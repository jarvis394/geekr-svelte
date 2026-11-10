/**
 * Extracts a few average colors from the bottom edge of an image, so a
 * blurred-looking glow can be drawn with a plain CSS gradient instead of a
 * full-size image with `filter: blur()`, which is very costly to composite.
 */

/** Amount of colors sampled along the bottom edge, left to right */
export const IMAGE_COLORS_COUNT = 4
/** Width of the image used for sampling */
const SAMPLE_WIDTH = 48
/** Part of the image height, from the bottom, that gets averaged */
const SAMPLE_BOTTOM_PART = 0.35
/** Same adjustments the blurred image used: `brightness-250 saturate-125` */
const BRIGHTNESS = 2.5
const SATURATION = 1.25

const HABRASTORAGE_REGEXP = /^(https?:)?\/\/habrastorage\.org\/(?:r\/w\d+\/)?(.+)$/

const cache = new Map<string, string[] | null>()
const pending = new Map<string, Promise<string[] | null>>()

/** Habrastorage can resize images on the fly, a tiny one is enough to get the colors */
const getSampleUrl = (src: string) => {
	const match = src.match(HABRASTORAGE_REGEXP)
	if (!match) return src
	return `https://habrastorage.org/r/w${SAMPLE_WIDTH}/${match[2]}`
}

const clamp = (value: number) => Math.min(255, Math.max(0, Math.round(value)))

/** Same math as CSS `brightness()` followed by `saturate()` */
const adjust = (r: number, g: number, b: number) => {
	r *= BRIGHTNESS
	g *= BRIGHTNESS
	b *= BRIGHTNESS
	r = Math.min(r, 255)
	g = Math.min(g, 255)
	b = Math.min(b, 255)
	const s = SATURATION
	return [
		clamp((0.213 + 0.787 * s) * r + (0.715 - 0.715 * s) * g + (0.072 - 0.072 * s) * b),
		clamp((0.213 - 0.213 * s) * r + (0.715 + 0.285 * s) * g + (0.072 - 0.072 * s) * b),
		clamp((0.213 - 0.213 * s) * r + (0.715 - 0.715 * s) * g + (0.072 + 0.928 * s) * b)
	]
}

const loadImage = (src: string) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image()
		image.crossOrigin = 'anonymous'
		image.decoding = 'async'
		image.onload = () => resolve(image)
		image.onerror = reject
		image.src = src
	})

const extract = async (src: string) => {
	const image = await loadImage(getSampleUrl(src))
	const width = Math.min(image.naturalWidth, SAMPLE_WIDTH) || SAMPLE_WIDTH
	const height = Math.max(
		1,
		Math.round((image.naturalHeight / (image.naturalWidth || 1)) * width) || width
	)
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const context = canvas.getContext('2d', { willReadFrequently: true })
	if (!context) return null
	context.drawImage(image, 0, 0, width, height)

	const fromY = Math.floor(height * (1 - SAMPLE_BOTTOM_PART))
	// Throws for images without CORS headers
	const { data } = context.getImageData(0, fromY, width, height - fromY)
	const rows = height - fromY
	const colors: string[] = []
	for (let i = 0; i < IMAGE_COLORS_COUNT; i++) {
		const fromX = Math.floor((i * width) / IMAGE_COLORS_COUNT)
		const toX = Math.floor(((i + 1) * width) / IMAGE_COLORS_COUNT)
		let r = 0
		let g = 0
		let b = 0
		let weight = 0
		for (let y = 0; y < rows; y++) {
			for (let x = fromX; x < toX; x++) {
				const offset = (y * width + x) * 4
				const alpha = data[offset + 3] / 255
				r += data[offset] * alpha
				g += data[offset + 1] * alpha
				b += data[offset + 2] * alpha
				weight += alpha
			}
		}
		if (weight === 0) {
			colors.push('transparent')
			continue
		}
		const [ar, ag, ab] = adjust(r / weight, g / weight, b / weight)
		colors.push(`rgb(${ar} ${ag} ${ab})`)
	}
	return colors
}

/** Colors that were already extracted, so remounted items render them right away */
export const getCachedImageColors = (src: string) => cache.get(src)

export const getImageColors = (src: string): Promise<string[] | null> => {
	if (cache.has(src)) return Promise.resolve(cache.get(src)!)
	let promise = pending.get(src)
	if (!promise) {
		promise = extract(src)
			.catch(() => null)
			.then((colors) => {
				cache.set(src, colors)
				pending.delete(src)
				return colors
			})
		pending.set(src, promise)
	}
	return promise
}
