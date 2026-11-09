import type { Component } from 'svelte'
import { Home, Compass } from '../components/svg'
import { Settings } from '@lucide/svelte'

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
		label: 'Хабы',
		href: '/hubs',
		route: '/hubs',
		icon: Compass
	},
	{
		label: 'Настройки',
		href: '/settings',
		route: '/settings',
		icon: Settings
	}
]
