import { HABR_BASE_REGEXP, HABR_LINKS_REPLACE_MAP } from '$lib/config/constants'

const formatLink = (s: string): string | false => {
	const baseMatch = HABR_BASE_REGEXP.exec(s)
	if (baseMatch) {
		const replaceObject = HABR_LINKS_REPLACE_MAP.find((e) => !!e.regexp.exec(s))
		// Cannot replace link, return false so TextFormatter leaves <a> as is
		if (!replaceObject) return false

		const matches = replaceObject.regexp.exec(s)
		let newHref = replaceObject.to
		matches?.slice(1)?.forEach((e, i) => {
			newHref = newHref.replace(`[${i}]`, e)
		})
		return newHref
	} else return false
}

export default formatLink
