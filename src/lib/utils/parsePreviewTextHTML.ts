const parsePreviewTextHtml = (html: string = '') => {
	const onlyClosingTagsRegexp = /(<\/p>)/gi
	const onlyTagsRegexp = /(<([^>]+)>)/gi
	const res = html
		.replaceAll('\n', ' ')
		.replaceAll('<br>', ' ')
		.replaceAll('&nbsp;', ' ')
		.replaceAll('&gt;', '>')
		.replaceAll('&lt;', '<')
		.replaceAll(onlyClosingTagsRegexp, ' ')
		.replaceAll(onlyTagsRegexp, '')
		.trim()

	return res
}

export default parsePreviewTextHtml
