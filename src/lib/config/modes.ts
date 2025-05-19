import type { ArticlesComplexity } from '$lib/types'
import type { GetArticlesParamsData } from '$lib/utils'

export type ModeItem = Partial<GetArticlesParamsData> & {
	label: string
	tabbarLabel: string
	// TODO: rethink, maybe not needed
	smUp?: boolean
}

export const TOP_MODES: ModeItem[] = [
	{
		label: 'Сутки',
		mode: 'top',
		period: 'daily',
		tabbarLabel: 'Топ дня'
	},
	{
		label: 'Неделя',
		mode: 'top',
		period: 'weekly',
		tabbarLabel: 'Топ недели'
	},
	{
		label: 'Месяц',
		mode: 'top',
		period: 'monthly',
		tabbarLabel: 'Топ месяца'
	},
	{
		label: 'Год',
		mode: 'top',
		period: 'yearly',
		tabbarLabel: 'Топ года'
	},
	{
		label: 'Всё время',
		mode: 'top',
		period: 'alltime',
		tabbarLabel: 'Топ за всё время'
	}
]
export const NEW_MODES: ModeItem[] = [
	{
		label: 'Все',
		mode: 'new',
		rating: 'all',
		tabbarLabel: 'Новые'
	},
	{
		label: '+0',
		mode: 'new',
		rating: 'rated0',
		tabbarLabel: 'Новые +0'
	},
	{
		label: '+10',
		mode: 'new',
		rating: 'rated10',
		tabbarLabel: 'Новые +10'
	},
	{
		label: '+25',
		mode: 'new',
		rating: 'rated25',
		tabbarLabel: 'Новые +25'
	},
	{
		label: '+50',
		mode: 'new',
		rating: 'rated50',
		tabbarLabel: 'Новые +50'
	},
	{
		label: '+100',
		mode: 'new',
		rating: 'rated100',
		tabbarLabel: 'Новые +100'
	}
]
export const ARTICLE_COMPLEXITY: Array<
	Omit<ModeItem, 'complexity'> & {
		complexity: ArticlesComplexity
	}
> = [
	{
		label: 'Любая',
		tabbarLabel: '',
		complexity: 'all'
	},
	{
		label: 'Лёгкая',
		tabbarLabel: 'Лёгкая сложность',
		complexity: 'easy'
	},
	{
		label: 'Средняя',
		tabbarLabel: 'Средняя сложность',
		complexity: 'medium'
	},
	{
		label: 'Сложная',
		tabbarLabel: 'Сложные статьи',
		complexity: 'hard'
	}
]
export const TABBAR_MODES: ModeItem[] = [
	TOP_MODES[0],
	TOP_MODES[1],
	{ ...TOP_MODES[2], smUp: true },
	NEW_MODES[0]
]
