import type { CapacitorConfig } from '@capacitor/cli'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getProperties } from 'properties-file'

const keystorePath = path.join('.', 'android', 'keystore.properties')
const keystore = getProperties(readFileSync(keystorePath))

const config: CapacitorConfig = {
	appId: 'com.jarvis394.geekr',
	appName: 'geekr.',
	webDir: 'build',
	plugins: {
		SplashScreen: {
			launchAutoHide: true
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
