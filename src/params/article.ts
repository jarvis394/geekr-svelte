import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string | number): param is number => {
	return !isNaN(Number(param)) && !isNaN(parseFloat(param.toString()))
}) satisfies ParamMatcher
