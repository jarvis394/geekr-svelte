type Direction = 'up' | 'down'

const State = {
	SHOW: false,
	HIDE: true
}

interface Options {
	threshold: number
	target: Window | Element
	triggerValue: boolean
	trigger: boolean
	enabled: boolean
	scrollThreshold: number
}

const defaultThreshold = 200
const defaultScrollThreshold = 200
const defaultTarget = typeof window !== 'undefined' ? window : null

export const state = $state({ trigger: false })

export const scrollTrigger = (options: Partial<Options> = {}) => {
	const {
		target = defaultTarget,
		threshold = defaultThreshold,
		scrollThreshold = defaultScrollThreshold,
		enabled = true
	} = options
	const initalScrollTop =
		(target && ('scrollY' in target ? target?.scrollY : target?.scrollTop)) || 0
	const initialTriggerValue = initalScrollTop > threshold
	let position = initalScrollTop
	let previousScroll = initalScrollTop
	let direction: Direction = 'down'
	state.trigger = initialTriggerValue

	const handleScroll = () => {
		if (!target) return

		const previousDirection = direction
		const currentScroll =
			(target && ('scrollY' in target ? target?.scrollY : target?.scrollTop)) || 0

		// Set the trigger to show if the scroll position is lower than a threshold
		if (currentScroll < scrollThreshold) return State.SHOW

		// Set current scroll direction
		if (currentScroll > previousScroll) {
			direction = 'down'
		} else {
			direction = 'up'
		}

		// If user changed their scroll direction, then set the store scroll once.
		if (direction !== previousDirection) {
			position = currentScroll
		}

		// Return false when user passed the threshold value by scrolling upwards
		if (direction === 'up') {
			if (position - threshold >= currentScroll) {
				state.trigger = State.SHOW
			}
		}
		// Return true when user passed the threshold value by scrolling downwards
		if (direction === 'down') {
			if (position + threshold <= currentScroll) {
				state.trigger = State.HIDE
			}
		}

		previousScroll = currentScroll
	}

	$effect(() => {
		if (enabled) {
			// passive: true enhances scrolling experience
			target?.addEventListener('scroll', handleScroll, { passive: true })
		}

		return () => {
			target?.removeEventListener('scroll', handleScroll)
		}
	})
}
