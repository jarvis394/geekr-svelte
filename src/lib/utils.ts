import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { GetArticlesParamsData } from './utils/articles'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getArticlesQueryKey = (articleParams: GetArticlesParamsData) => {
	return [
		'articles',
		articleParams.mode,
		articleParams.period,
		articleParams.rating,
		articleParams.complexity,
		articleParams.page
	]
}
