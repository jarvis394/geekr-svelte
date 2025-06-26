import adapterVercel from '@sveltejs/adapter-vercel'
import adapterStatic from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const isVercel = process.env.VERCEL === '1'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		serviceWorker: {
			register: process.env.MODE === 'production'
		},
		adapter: isVercel
			? adapterVercel({
					runtime: 'edge'
				})
			: adapterStatic({
					fallback: 'index.html'
				})
	}
}

export default config
