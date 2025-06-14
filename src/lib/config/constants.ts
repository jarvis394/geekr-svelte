export const SENTRY_DSN_URL =
	'https://564d962b8212ce6df836a684cbfe85dc@o4509498673004544.ingest.de.sentry.io/4509498673987664'
export const API_URL = 'https://habr.com/kek/'

export const HABR_BASE_REGEXP = /(habr|m\.habr)\.com\/(ru|en)\/(.+)/
export const HABR_LINKS_REPLACE_MAP = [
	{
		regexp: /companies\/?(.+)\/articles\/([0-9]+)[/]?/,
		to: '/companies/[0]/articles/[1]'
	},
	{
		regexp: /articles\/?(.+)[/]?/,
		to: '/articles/[0]'
	},
	{
		regexp: /news\/t\/?(.+)[/]?/,
		to: '/news/[0]'
	},
	{
		regexp: /posts\/t\/?(.+)[/]?/,
		to: '/posts/[0]'
	}
]
