import { sequence } from '@sveltejs/kit/hooks'
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit'
import { SENTRY_DSN_URL } from '$lib/config/constants'
import * as Sentry from '@sentry/sveltekit'

Sentry.init({
	dsn: SENTRY_DSN_URL,
	tracesSampleRate: 1.0
})

export const handle = sequence(sentryHandle())

export const handleError = handleErrorWithSentry()
