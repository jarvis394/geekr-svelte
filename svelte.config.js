import adapterVercel from '@sveltejs/adapter-vercel'
import adapterStatic from '@sveltejs/adapter-static'
import adapterBun from 'svelte-adapter-bun'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const isVercel = process.env.VERCEL === '1'
const isStatic = process.env.IS_STATIC === 'true'

const getAdapter = () => {
	if (isVercel) {
		return adapterVercel({
			runtime: 'edge'
		})
	}

	if (isStatic) {
		return adapterStatic({
			fallback: 'index.html'
		})
	}

	return adapterBun()
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		experimental: {
			forkPreloads: true,
		},
		serviceWorker: {
			register: process.env.MODE === 'production'
		},
		adapter: getAdapter()
	}
}

export default config
