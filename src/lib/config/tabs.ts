import type { Component } from 'svelte'
import { Home, Scroll, Compass, NewsFeed } from '../components/svg'

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
		icon: NewsFeed
	},
	{
		label: 'Посты',
		href: '/posts',
		route: '/posts/[...params]',
		icon: Scroll
	},
	{
		label: 'Хабы',
		href: '/hubs',
		route: '/hubs',
		icon: Compass
	}
]
