<script lang="ts">
	import { ArticleItem } from '$lib/components/article-item'
	import { Pagination } from '$lib/components/pagination'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import type { PageProps } from './$types'
	import { goto } from '$app/navigation'
	import { makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils/articles'
	import ArticlesSwitcher from '$lib/components/articles-switcher/articles-switcher.svelte'
	import { AppBar } from '$lib/components/appbar'

	const { data }: PageProps = $props()

	const handlePageChange = (page: number) => {
		goto('/articles' + makeArticlesPageUrlFromParams({ ...data.articleParams, page }))
	}

	const getPageTitle = (articleParams: GetArticlesParamsData) => {
		const isModeTop = articleParams.mode === 'top'
		let complexity = isModeTop ? '' : 'статьи'

		if (articleParams.complexity === 'easy') {
			complexity = isModeTop ? 'из простого' : 'простые статьи'
		} else if (articleParams.complexity === 'medium') {
			complexity = isModeTop ? 'средней сложности' : 'статьи средней сложности'
		} else if (articleParams.complexity === 'hard') {
			complexity = isModeTop ? 'из сложного' : 'статьи средней сложности'
		}

		if (articleParams.mode === 'top') {
			let period = ''

			if (articleParams.period === 'alltime') {
				period = 'все время'
			} else if (articleParams.period === 'daily') {
				period = 'день'
			} else if (articleParams.period === 'monthly') {
				period = 'месяц'
			} else if (articleParams.period === 'weekly') {
				period = 'неделю'
			} else if (articleParams.period === 'yearly') {
				period = 'год'
			}

			return `Лучшее${complexity ? ' ' + complexity : ''} за ${period}`
		} else {
			let rating = ''

			if (articleParams.rating === 'rated0') {
				rating = ' ≥0'
			} else if (articleParams.rating === 'rated10') {
				rating = ' ≥10'
			} else if (articleParams.rating === 'rated25') {
				rating = ' ≥25'
			} else if (articleParams.rating === 'rated50') {
				rating = ' ≥50'
			} else if (articleParams.rating === 'rated100') {
				rating = ' ≥100'
			}

			return `Все ${complexity}${rating} подряд`
		}
	}
</script>

<svelte:head>
	<title>{getPageTitle(data.articleParams) || 'Статьи'} / geekr.</title>
</svelte:head>
<div class="flex w-full flex-col gap-0">
	<AppBar />
	<ArticlesSwitcher articleParams={data.articleParams} />
	{#await data.articles}
		<div class="relative h-[10000px] w-full">
			<div class="sticky top-12 flex w-full items-center justify-center py-16">
				<LoaderCircle class="animate-spin" />
			</div>
		</div>
	{:then articles}
		<div class="reveal relative flex w-full flex-col gap-0 after:top-[48px] after:h-[100vh-48px]">
			{#each articles.publicationIds as id}
				<ArticleItem article={articles.publicationRefs[id]} />
			{/each}
		</div>
		<Pagination
			onPageChange={handlePageChange}
			count={articles.pagesCount}
			page={data.articleParams.page}
		/>
	{/await}
</div>
