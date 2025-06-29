<script lang="ts">
	import type { ArticleFormat } from '$lib/types'
	import { Badge } from '../ui/badge'
	import type { BadgeColor } from '../ui/badge/badge.svelte'

	export type ArticleFormatLabelProps = {
		data: ArticleFormat
	}

	const ARTICLE_FORMAT_COLOR_MAP: Record<ArticleFormat, BadgeColor> = {
		season: 'rose',
		megapostType: 'fuchsia',
		habrItMedia: 'darkBlue',
		interview: 'emerald',
		reportage: 'emerald',
		case: 'sky',
		opinion: 'sky',
		digest: 'sky',
		review: 'sky',
		'target-audience': 'sky',
		tutorial: 'darkOrange',
		faq: 'darkOrange',
		roadmap: 'darkOrange',
		analytics: 'fuchsia',
		retrospective: 'fuchsia'
	}

	const ARTICLE_FORMAT_LABEL_MAP: Record<ArticleFormat, string> = {
		season: 'Сезон',
		megapostType: 'Мегапост',
		habrItMedia: 'Хабр Медиа',
		interview: 'Интервью',
		reportage: 'Репортаж',
		case: 'Кейс',
		opinion: 'Мнение',
		digest: 'Дайджест',
		review: 'Обзор',
		tutorial: 'Туториал',
		faq: 'FAQ',
		roadmap: 'Роадмап',
		analytics: 'Аналитика',
		retrospective: 'Ретроспектива',
		'target-audience': 'Таргет'
	}

	const { data }: ArticleFormatLabelProps = $props()
	const color = $derived(ARTICLE_FORMAT_COLOR_MAP[data])
	const label = $derived(ARTICLE_FORMAT_LABEL_MAP[data])
</script>

<Badge {color}>{label}</Badge>
