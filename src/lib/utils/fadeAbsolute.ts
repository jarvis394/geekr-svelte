import type { TransitionConfig } from 'svelte/transition'

export const fadeAbsolute = (
	_node: HTMLElement,
	params?: { delay?: number; duration?: number; easing?: (t: number) => number; enabled?: boolean }
) => {
	if (params?.enabled) {
		return {
			...params,
			css: (t) => `opacity: ${t}; position: absolute;`
		} satisfies TransitionConfig
	}

	return {}
}
