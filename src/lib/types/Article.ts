import type { Flow, ArticleLabel, HubArticleLabels, ProfileExtended } from '.'

export interface SchemaJsonLd {
	'@context': string
	'@type': string
	mainEntityOfPage: {
		'@type': string
		'@id': string
	}
	headline: string
	datePublished: string
	dateModified: string
	author: { '@type': string; name: string }
	publisher: {
		'@type': string
		name: string
		logo: {
			'@type': string
			url: string
		}
	}
	description: string
	url: string
	about: string[]
	image: string[]
}

export interface Article {
	id: string | number
	author: ProfileExtended
	commentsEnabled: boolean
	complexity: 'low' | 'medium' | 'hard' | null
	format: 'review' | 'opinion' | 'analytics' | 'retrospective' | 'tutorial' | null
	editorVersion: '1.0' | '2.0'
	flows: Flow[]
	hubs: HubArticleLabels[]
	isCorporative: boolean
	isInBlacklist: boolean
	isEditorial: boolean
	lang: 'ru' | 'en'
	leadData: {
		buttonTextHtml: string
		imageUrl: string | null
		textHtml: string
		image: {
			fit: 'cover'
			positionX: number
			positionY: number
			url: string
		}
	}
	metadata: {
		metaDescription: string
		schemaJsonLd: string
		scriptUrls: string[]
		shareImageHeight: number
		shareImageWidth: number
		shareImageUrl: string
		stylesUrls: string[]
		vkShareImageUrl: string
	}
	polls: never[]
	postLabels: ArticleLabel[]
	postType: 'article' | 'news' | 'post' | 'voice'
	publicationType: 'article' | 'news' | 'post' | 'voice'
	readingTime: number
	statistics: {
		commentsCount: number
		favoritesCount: number
		readingCount: number
		score: number
		votesCount: number
		votesCountMinus: number
		votesCountPlus: number
	}
	tags: { titleHtml: string }[]
	timePublished: string
	titleHtml: string
	textHtml: string
	translationData: {
		originalAuthorName: string
		originalUrl: string
	}
	relatedData?: {
		bookmarked: boolean
		canComment: boolean
		canEdit: boolean
		canViewVotes: boolean
		canVote: boolean
		unreadCommentsCount: number
		vote: {
			value: number | null
			voteTimeExpired: string
		}
	}
	votesEnabled: boolean

	/** Contains an URL of the first image in text preview */
	leadImage?: string
}
