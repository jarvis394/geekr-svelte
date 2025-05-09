import type { Article } from '.'
import { z } from 'zod'

export interface ArticlesResponse {
	pagesCount: number
	publicationRefs: Record<string, Article>
	publicationIds: string[]
}

export const articlesModeSchema = z.enum(['new', 'top']).optional().default('new')
export const articlesPeriodSchema = z
	.enum(['daily', 'weekly', 'monthly', 'yearly', 'alltime'])
	.optional()
	.default('daily')
export const articlesRatingSchema = z
	.enum(['all', 'rated0', 'rated10', 'rated25', 'rated50', 'rated100'])
	.optional()
	.default('all')
export const articlesComplexitySchema = z
	.enum(['all', 'easy', 'medium', 'hard'])
	.optional()
	.default('all')
export const articlesFlowSchema = z
	.enum(['all', 'develop', 'design', 'admin', 'management', 'marketing', 'popsci'])
	.optional()
	.default('all')
export const articlesPageSchema = z
	.preprocess((e) => (e ? Number(e) : 1), z.number())
	.optional()
	.default(1)

export type ArticlesMode = z.infer<typeof articlesModeSchema>
export type ArticlesPeriod = z.infer<typeof articlesPeriodSchema>
export type ArticlesRating = z.infer<typeof articlesRatingSchema>
export type ArticlesComplexity = z.infer<typeof articlesComplexitySchema>
export type ArticlesFlow = z.infer<typeof articlesFlowSchema>
