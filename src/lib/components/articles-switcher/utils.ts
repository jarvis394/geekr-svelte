import { type ModeItem, TOP_MODES, NEW_MODES, ARTICLE_COMPLEXITY } from '$lib/config/modes'
import { makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils'

export const excludeKeys = (key: string): key is 'label' | 'tabbarLabel' | 'smUp' =>
	['label', 'tabbarLabel', 'smUp'].includes(key)
export const isSelected = (
	mode: ModeItem,
	selectedMode: Partial<ModeItem>,
	exactComplexity: boolean = false
) => {
	if (mode.mode !== selectedMode.mode) {
		return false
	}

	if (
		exactComplexity &&
		selectedMode.complexity !== 'all' &&
		mode.complexity !== selectedMode.complexity
	) {
		return false
	}

	if (mode.mode === 'new' && mode.rating !== selectedMode.rating) {
		return false
	}

	if (mode.mode === 'top' && mode.period !== selectedMode.period) {
		return false
	}

	return true
}

export const isSelectedInsideModes = (mode: ModeItem, modes: ModeItem[]) => {
	return modes.some((e) => isSelected(e, mode, true))
}

export const getSelectedComplexityFromParams = (params: GetArticlesParamsData) => {
	const res = ARTICLE_COMPLEXITY.find((item) => item.complexity === params.complexity)
	return res || ARTICLE_COMPLEXITY[0]
}

export const getSelectedModeFromParams = (params: GetArticlesParamsData): ModeItem => {
	const { flow, complexity } = params
	const res = TOP_MODES.concat(NEW_MODES).find((mode) => isSelected(mode, params))
	return { ...(res || TOP_MODES[0]), complexity, flow }
}

export const saveModeOnClient = (
	mode: ModeItem,
	articlesMode: 'articles' | 'news' | 'posts' = 'articles'
) => {
	// Remove first slash from mode and save it on client
	localStorage.setItem(
		'mode:' + articlesMode,
		makeArticlesPageUrlFromParams(mode, articlesMode).replace('/', '')
	)
}
