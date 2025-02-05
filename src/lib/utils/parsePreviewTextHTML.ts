const parsePreviewTextHtml = (html: string) => {
	const onlyTagsRegexp = /(<([^>]+)>)/gi
	const res = html.replaceAll('<br>', ' ').replaceAll('&nbsp;', ' ').replaceAll(onlyTagsRegexp, '')

	return res
}

export default parsePreviewTextHtml
