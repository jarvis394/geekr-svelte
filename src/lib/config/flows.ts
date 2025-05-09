import type { ArticlesFlow } from '$lib/types'

interface Flow {
	title: string
	alias: ArticlesFlow
}

export const FLOWS: Flow[] = [
	{
		title: 'Все потоки',
		alias: 'all'
	},
	{
		title: 'Разработка',
		alias: 'develop'
	},
	{
		title: 'Администрирование',
		alias: 'admin'
	},
	{
		title: 'Дизайн',
		alias: 'design'
	},
	{
		title: 'Менеджмент',
		alias: 'management'
	},
	{
		title: 'Маркетинг',
		alias: 'marketing'
	},
	{
		title: 'Научпоп',
		alias: 'popsci'
	}
]

export const FLOWS_MAP: Record<ArticlesFlow, Flow> = {
	all: {
		title: 'Все потоки',
		alias: 'all'
	},
	develop: {
		title: 'Разработка',
		alias: 'develop'
	},
	admin: {
		title: 'Администрирование',
		alias: 'admin'
	},
	design: {
		title: 'Дизайн',
		alias: 'design'
	},
	management: {
		title: 'Менеджмент',
		alias: 'management'
	},
	marketing: {
		title: 'Маркетинг',
		alias: 'marketing'
	},
	popsci: {
		title: 'Научпоп',
		alias: 'popsci'
	}
}
