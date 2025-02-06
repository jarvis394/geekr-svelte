export interface ArticleLabel {
	data: Record<string, string>
	title: string
	typeOf: 'system'
	type:
	| 'technotext2022'
	| 'technotext2021'
	| 'technotext2020'
	| 'translation'
	| 'sandbox'
	| 'recovery'
	| 'tutorial'
}
