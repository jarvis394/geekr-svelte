import { type ModeItem, TOP_MODES, NEW_MODES, ARTICLE_COMPLEXITY } from '$lib/config/modes'
import { makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils'

export const excludeKeys = (key: string): key is 'label' | 'tabbarLabel' | 'complexity' | 'smUp' =>
	['label', 'tabbarLabel', 'smUp', 'complexity'].includes(key)
export const isSelected = (mode: ModeItem, selectedMode: Partial<ModeItem>) => {
	for (const key in mode) {
		const typedKey = key as keyof ModeItem
		if (excludeKeys(typedKey)) continue

		const value = mode[typedKey]
		const propsValue = selectedMode[typedKey]

		if (value !== propsValue) {
			return false
		}
	}
	return true
}

export const isSelectedInsideModes = (mode: ModeItem, modes: ModeItem[]) => {
	return modes.some((e) => isSelected(e, mode))
}

export const getSelectedComplexityFromParams = (params: GetArticlesParamsData) => {
	const res = ARTICLE_COMPLEXITY.find((item) => item.complexity === params.complexity)
	return res || ARTICLE_COMPLEXITY[0]
}

export const getSelectedModeFromParams = (params: GetArticlesParamsData): ModeItem => {
	const complexity = getSelectedComplexityFromParams(params)
	const res = TOP_MODES.concat(NEW_MODES).find((mode) => isSelected(mode, params))
	return { ...(res || TOP_MODES[0]), complexity: complexity.complexity }
}

export const saveModeOnClient = (mode: ModeItem) => {
	// Remove first slash from mode and save it on client
	localStorage.setItem('mode', makeArticlesPageUrlFromParams(mode).replace('/', ''))
}
