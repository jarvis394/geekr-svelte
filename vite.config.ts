import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'

export default defineConfig({
	server: {
		host: true,
		warmup: {
			clientFiles: ['./src/routes/**/*', '!./src/routes/**/*.server.ts']
		}
	},
	plugins: [devtoolsJson(), tailwindcss(), sveltekit()]
})
