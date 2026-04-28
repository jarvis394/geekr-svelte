import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'

export default defineConfig({
	resolve: {
		alias: [
			{
				find: 'html-dom-parser',
				replacement: 'html-dom-parser/lib/server/html-to-dom'
			}
		]
	},
	ssr: {
		optimizeDeps: {
			include: ['@jarvis394/html-svelte-parser']
		}
	},
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		warmup: {
			clientFiles: ['./src/routes/**/*', '!./src/routes/**/*.server.ts']
		},
		watch: {
			ignored: ['./android/**', 'capacitor.config.ts']
		}
	},
	plugins: [devtoolsJson(), tailwindcss(), sveltekit()]
})
