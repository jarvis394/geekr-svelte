/// <reference types="@capacitor/splash-screen" />
import type { CapacitorConfig } from '@capacitor/cli'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getProperties } from 'properties-file'
import ip from 'ip'

const keystorePath = path.join('.', 'android', 'keystore.properties')
let keystore: Record<string, string> = {}
try {
	keystore = getProperties(readFileSync(keystorePath))
} catch (e) {
	console.warn('Could not parse keystore.properties file: ' + (e as Error).message)
}

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
			launchAutoHide: true,
			androidSplashResourceName: 'ic_splash'
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
			keystoreAliasPassword: keystore.keyPassword,
			releaseType: 'APK',
			signingType: 'jarsigner'
		}
	}
}

export default config
