import type { TransitionConfig } from 'svelte/transition'

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
