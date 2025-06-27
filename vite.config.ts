import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'

export default defineConfig({
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		warmup: {
			clientFiles: ['./src/routes/**/*', '!./src/routes/**/*.server.ts']
		},
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ['./android/**', 'capacitor.config.ts']
		}
	},
	plugins: [devtoolsJson(), tailwindcss(), sveltekit()]
})
