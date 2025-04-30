type TranslationArticleLabel = {
	data: {
		originalAuthorName: string
		originalUrl: string
	}
	title: string
	typeOf: 'system'
	type: 'translation'
}

type BaseArticleLabel = {
	data: Record<string, string>
	title: string
	typeOf: 'system'
	type: 'technotext2022' | 'technotext2021' | 'technotext2020' | 'sandbox' | 'recovery' | 'tutorial'
}

export type ArticleLabel = BaseArticleLabel | TranslationArticleLabel
