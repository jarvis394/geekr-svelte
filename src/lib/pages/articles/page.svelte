<script lang="ts">
	import { Pagination } from '$lib/components/pagination'
	import type { PageProps } from '../../../routes/articles/[...params]/$types'
	import { goto } from '$app/navigation'
	import { makeArticlesPageUrlFromParams, type GetArticlesParamsData } from '$lib/utils/articles'
	import ArticlesSwitcher from '$lib/components/articles-switcher/articles-switcher-row.svelte'
	import { AppBar } from '$lib/components/appbar'
	import { ArticleItemPostSkeleton } from '$lib/components/skeletons'
	import { cn, fadeAbsolute } from '$lib/utils'
	import { ArticleItem } from '$lib/components/article-item'

	const { data }: PageProps = $props()

	const handlePageChange = (page: number) => {
		goto(makeArticlesPageUrlFromParams({ ...data.articleParams, page }))
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
	<ArticlesSwitcher
		class="min-lg:hidden"
		articlesParams={data.articleParams}
		articlesMode={data.articlesMode}
	/>
	{#await data.articles}
		<div class="relative">
			<div
				class="relative flex w-full flex-col gap-0"
				out:fadeAbsolute={{ duration: 200, disabled: data.cache }}
			>
				{#each Array(20).fill(null)}
					<ArticleItemPostSkeleton />
				{/each}
			</div>
		</div>
	{:then articles}
		<div class={cn('animate-in fade-in relative flex w-full flex-col gap-0 transition-all')}>
			{#each articles.publicationIds as id (id)}
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
