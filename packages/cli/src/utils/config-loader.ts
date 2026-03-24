import fs from 'node:fs/promises'
import path from 'node:path'

export interface RushConfig {
	apiUrl: string
	apiToken: string
	siteSlug: string
}

export async function loadConfig(): Promise<RushConfig> {
	const envConfig = loadFromEnv()
	if (envConfig) return envConfig

	const dotenvConfig = await loadFromDotenv()
	if (dotenvConfig) return dotenvConfig

	throw new Error(
		'Missing Rush CMS configuration.\n' +
		'Set environment variables (RUSH_API_URL, RUSH_API_TOKEN, RUSH_SITE_SLUG)\n' +
		'or create a .env file with these values.'
	)
}

function loadFromEnv(): RushConfig | null {
	const apiUrl = process.env.RUSH_API_URL
	const apiToken = process.env.RUSH_API_TOKEN
	const siteSlug = process.env.RUSH_SITE_SLUG

	if (apiUrl && apiToken && siteSlug) {
		return { apiUrl, apiToken, siteSlug }
	}
	return null
}

async function loadFromDotenv(): Promise<RushConfig | null> {
	const envPath = path.resolve(process.cwd(), '.env')

	try {
		const content = await fs.readFile(envPath, 'utf-8')
		const vars: Record<string, string> = {}

		for (const line of content.split('\n')) {
			const trimmed = line.trim()
			if (!trimmed || trimmed.startsWith('#')) continue
			const eqIdx = trimmed.indexOf('=')
			if (eqIdx === -1) continue
			const key = trimmed.slice(0, eqIdx).trim()
			const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
			vars[key] = value
		}

		const apiUrl = vars.RUSH_API_URL
		const apiToken = vars.RUSH_API_TOKEN
		const siteSlug = vars.RUSH_SITE_SLUG

		if (apiUrl && apiToken && siteSlug) {
			return { apiUrl, apiToken, siteSlug }
		}
	} catch {
		return null
	}

	return null
}
