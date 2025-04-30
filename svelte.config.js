import adapterAuto from '@sveltejs/adapter-auto'
import adapterVercel from '@sveltejs/adapter-vercel'
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
			: adapterAuto()
	}
}

export default config
