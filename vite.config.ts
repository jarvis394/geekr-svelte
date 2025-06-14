import { sentrySvelteKit } from '@sentry/sveltekit'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'

export default defineConfig({
	server: {
		host: true,
		warmup: {
			clientFiles: ['./src/routes/**/*']
		}
	},
	ssr: {
		external: ['@napi-rs/canvas-linux-x64-musl', '@napi-rs/canvas-linux-x64-gnu']
	},
	optimizeDeps: {
		exclude: ['@napi-rs/canvas-linux-x64-musl', '@napi-rs/canvas-linux-x64-gnu']
	},
	build: {
		rollupOptions: {
			external: ['@napi-rs/canvas-linux-x64-musl', '@napi-rs/canvas-linux-x64-gnu']
		}
	},
	assetsInclude: ['**/*.node'],
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'geekr',
				project: 'geekr'
			}
		}),
		devtoolsJson(),
		tailwindcss(),
		sveltekit()
	]
})
