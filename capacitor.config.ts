/// <reference types="@capacitor/splash-screen" />
import type { CapacitorConfig } from '@capacitor/cli'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getProperties } from 'properties-file'
import ip from 'ip'

const keystorePath = path.join('.', 'android', 'keystore.properties')
const keystore = getProperties(readFileSync(keystorePath))
const isLocalDev = process.env.CAPACITOR_DEV === 'true'
const localIp = ip.address()
const localServerAddress = `http://${localIp}:5173`

if (isLocalDev) {
	console.log(`[!] Using local development server on ${localServerAddress}\n`)
}

const config: CapacitorConfig = {
	appId: 'com.jarvis394.geekr',
	appName: 'geekr.',
	webDir: 'build',
	server: isLocalDev
		? {
				url: localServerAddress,
				cleartext: true
			}
		: undefined,
	plugins: {
		SplashScreen: {
			launchAutoHide: false,
			backgroundColor: '#0B0809',
			showSpinner: true
		},
		CapacitorHttp: {
			enabled: true
		},
		CapacitorCookies: {
			enabled: true
		}
	},
	android: {
		buildOptions: {
			keystorePath: keystore.storeFile,
			keystorePassword: keystore.storePassword,
			keystoreAlias: keystore.keyAlias,
			keystoreAliasPassword: keystore.keyPassword
		}
	}
}

export default config
