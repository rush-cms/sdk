import { RushCMSClient } from '@rushcms/client'

const baseUrl = import.meta.env.VITE_RUSHCMS_BASE_URL
const apiToken = import.meta.env.VITE_RUSHCMS_API_TOKEN
const siteSlug = import.meta.env.VITE_RUSHCMS_SITE_SLUG

if (!baseUrl) {
	throw new Error('Missing VITE_RUSHCMS_BASE_URL environment variable')
}

if (!apiToken) {
	throw new Error('Missing VITE_RUSHCMS_API_TOKEN environment variable')
}

if (!siteSlug) {
	throw new Error('Missing VITE_RUSHCMS_SITE_SLUG environment variable')
}

export const rushcmsClient = new RushCMSClient({
	baseUrl,
	apiToken,
	siteSlug,
	cache: {
		enabled: true,
		ttl: 3600
	}
})
