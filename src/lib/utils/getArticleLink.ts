import type { Article } from '$lib/types'

export default (article: Article) => {
	if (!article) return null

	const { id, publicationType, isCorporative } = article
	const companyAlias = article.hubs.find((e) => e.type === 'corporative')?.alias
	let mode = 'articles'

	if (publicationType === 'post') {
		mode = 'posts'
	} else if (publicationType === 'news') {
		mode = 'news'
	}

	if (isCorporative) {
		return '/companies/' + companyAlias + '/articles/' + id
	}

	return '/' + mode + '/' + id
}
