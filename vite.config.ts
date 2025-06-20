import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'

export default defineConfig({
	server: {
		host: true,
		// TODO: fix +page.server.ts files
		// warmup: {
		// 	clientFiles: ['./src/routes/**/*']
		// }
	},
	plugins: [
		devtoolsJson(),
		tailwindcss(),
		sveltekit()
	]
})
