import type { TransitionConfig } from 'svelte/transition'
import { map } from './map'

export const fadeAbsolute = (
	_node: HTMLElement,
	params?: { delay?: number; duration?: number; easing?: (t: number) => number; disabled?: boolean }
) => {
	if (params?.disabled) return {}

	return {
		...params,
		css: (t) => `opacity: ${t}; position: absolute;`
	} satisfies TransitionConfig
}

export const fadeFixed = (
	_node: HTMLElement,
	params?: { delay?: number; duration?: number; easing?: (t: number) => number; disabled?: boolean }
) => {
	if (params?.disabled) return {}

	return {
		...params,
		css: (t) => `opacity: ${t}; position: fixed;`
	} satisfies TransitionConfig
}

export const hideAbsolute = (
	node: HTMLElement,
	params?: { delay?: number; duration?: number; easing?: (t: number) => number }
) => {
	const existingStyle = node.style

	return {
		...params,
		tick: (t) => {
			node.style =
				existingStyle +
				`;
			position: absolute;
			mask-image: linear-gradient(
				to bottom,
				rgb(0 0 0 / 0%),
				rgb(0 0 0 / 100%),
				rgb(0 0 0 / 100%),
				rgb(0 0 0 / 0%)
			);
			mask-size: 100% 300%;
			mask-repeat: no-repeat;
			user-select: none;
			pointer-events: none;
			mask-position: 0% ${map(t, 0, 1, -50, 50)}%;
			`
		}
	} satisfies TransitionConfig
}
