import { TOP_MODES } from '$lib/config/modes'
import { parseArticlesParams, type GetArticlesParamsData } from './articles'

export default (): Partial<GetArticlesParamsData> => {
	const cachedModeString = localStorage.getItem('mode')
	const mode = cachedModeString !== null && parseArticlesParams(cachedModeString.split('/'))

	if (mode && mode.success) {
		return mode.data
	} else {
		return TOP_MODES[0]
	}
}
