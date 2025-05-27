import type { Component } from 'svelte'
import { Home, Document } from '../components/svg'
import { Rss, Compass } from '@lucide/svelte'

type AppTab = {
	label: string
	href: string
	route: string
	icon: Component
}

export const APP_TABS: AppTab[] = [
	{
		label: 'Главная',
		href: '/',
		route: '/',
		icon: Home
	},
	{
		label: 'Новости',
		href: '/news',
		route: '/news/[...params]',
		icon: Rss
	},
	{
		label: 'Посты',
		href: '/posts',
		route: '/posts/[...params]',
		icon: Document
	},
	{
		label: 'Хабы',
		href: '/hubs',
		route: '/hubs',
		icon: Compass
	}
]
