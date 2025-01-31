export interface Flow {
	id: string | number
	name: string
	alias: string
	url: string
	path: string
}

export type FlowAlias =
	| 'all'
	| 'develop'
	| 'design'
	| 'admin'
	| 'management'
	| 'marketing'
	| 'popsci'
