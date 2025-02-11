import type { Article } from '$lib/types'
import getImagesFromText from './getImagesFromText'

export default (article: Article) => {
	if (article.leadData.imageUrl) return article.leadData.imageUrl

	const imageURLRegExResults = getImagesFromText(article?.textHtml || article?.leadData?.textHtml)

	return imageURLRegExResults ? imageURLRegExResults[1] : null
}
