import { SENTRY_DSN_URL } from '$lib/config/constants'
import { handleErrorWithSentry } from '@sentry/sveltekit'
import * as Sentry from '@sentry/sveltekit'

Sentry.init({
	dsn: SENTRY_DSN_URL,
	tracesSampleRate: 1.0
})

export const handleError = handleErrorWithSentry()
