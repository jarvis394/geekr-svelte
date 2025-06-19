import { z } from 'zod'
import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { error, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

const csrfRegexp = /<meta\s+name="csrf-token"\s+content="([^"]+)"/i

const AuthSchema = z
	.object({
		email: z.string().email(),
		password: z.string(),
		'h-captcha-response': z.string(),
		'g-recaptcha-response': z.string()
	})
	.transform((obj) => ({
		...obj,
		hCaptchaResponse: obj['h-captcha-response'],
		gRecaptchaResponse: obj['g-recaptcha-response']
	}))

const IdentResponseSchema = z.union([
	z.object({
		success: z.literal(true),
		rurl: z.string()
	}),
	z.object({
		success: z.literal(false),
		error: z.string().optional(),
		errors: z
			.object({
				'h-captcha-response': z.string()
			})
			.optional()
	})
])

const getAccountAuthData = async ({
	email,
	password,
	hCaptchaResponse,
	gRecaptchaResponse
}: {
	email: string
	password: string
	hCaptchaResponse?: string
	gRecaptchaResponse?: string
}) => {
	const jar = new CookieJar()
	const client = wrapper(axios.create({ jar }))

	const res = await client.get<string>('https://habr.com/kek/v1/auth/habrahabr/')
	const match = res.data.match(/ident\/([^"]*)/)
	const identUrl = 'https://account.habr.com/en/ident/' + match?.[1]
	const params = new URLSearchParams()
	params.append('email', email)
	params.append('password', password)

	if (hCaptchaResponse) {
		params.append('h-captcha-response', hCaptchaResponse)
	}

	if (gRecaptchaResponse) {
		params.append('g-recaptcha-response', gRecaptchaResponse)
	}

	const identRes = await client.post(identUrl, params, {
		withCredentials: true
	})

	const parsedIdentRes = IdentResponseSchema.safeParse(identRes.data)

	if (!parsedIdentRes.success) {
		throw error(500, 'Could not parse ident response')
	}

	if (!parsedIdentRes.data.success) {
		let message = parsedIdentRes.data.error || 'Session expired'

		if (parsedIdentRes.data.errors?.['h-captcha-response']) {
			message = parsedIdentRes.data.errors?.['h-captcha-response']
		}

		throw error(403, message)
	}

	const rurl = parsedIdentRes.data.rurl
	const rurlRes = await client.get<string>(rurl)
	const cookies = await jar.getCookies('https://habr.com')
	const csrf = rurlRes.data.match(csrfRegexp)?.[1]

	return { cookies, csrf }
}

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData()
		const parseResult = AuthSchema.safeParse(Object.fromEntries(formData))

		if (!parseResult.success) return parseResult.error

		const data = await getAccountAuthData({ ...parseResult.data })

		data.cookies.forEach((cookie) => {
			event.cookies.set(cookie.key, cookie.value, {
				path: '/',
				expires: cookie.expiryDate(),
				...(typeof cookie.maxAge === 'number' && { maxAge: cookie.maxAge })
			})
		})

		if (data.csrf) {
			event.cookies.set('csrf-token', data.csrf, {
				path: '/'
			})
		}

		event.cookies.set('is-authorized', 'true', {
			path: '/',
			httpOnly: false,
			secure: false
		})

		return redirect(302, '/')
	}
} satisfies Actions
