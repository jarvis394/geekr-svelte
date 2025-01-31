import type { Article } from '$lib/types'

export default (article: Article) => {
	if (!article) return null

	const { id, isCorporative } = article
	const companyAlias = article.hubs.find((e) => e.type === 'corporative')?.alias

	if (isCorporative) {
		return '/companies/' + companyAlias + '/articles/' + id
	}

	return '/articles/' + id
}
