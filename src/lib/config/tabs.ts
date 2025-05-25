import type { Component } from 'svelte'
import { Home, Document } from '../components/svg'
import { Rss, Compass } from '@lucide/svelte'

type AppTab = {
	label: string
	href: string
	icon: Component
}

export const APP_TABS: AppTab[] = [
	{
		label: 'Главная',
		href: '/',
		icon: Home
	},
	{
		label: 'Новости',
		href: '/news',
		icon: Rss
	},
	{
		label: 'Посты',
		href: '/posts',
		icon: Document
	},
	{
		label: 'Хабы',
		href: '/',
		icon: Compass
	}
]
