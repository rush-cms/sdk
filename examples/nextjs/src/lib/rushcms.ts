import { RushCMSClient } from '@rushcms/client'

if (!process.env.NEXT_PUBLIC_RUSHCMS_BASE_URL) {
	throw new Error('Missing NEXT_PUBLIC_RUSHCMS_BASE_URL environment variable')
}

if (!process.env.NEXT_PUBLIC_RUSHCMS_API_TOKEN) {
	throw new Error('Missing NEXT_PUBLIC_RUSHCMS_API_TOKEN environment variable')
}

if (!process.env.NEXT_PUBLIC_RUSHCMS_SITE_SLUG) {
	throw new Error('Missing NEXT_PUBLIC_RUSHCMS_SITE_SLUG environment variable')
}

export const rushcmsClient = new RushCMSClient({
	baseUrl: process.env.NEXT_PUBLIC_RUSHCMS_BASE_URL,
	apiToken: process.env.NEXT_PUBLIC_RUSHCMS_API_TOKEN,
	siteSlug: process.env.NEXT_PUBLIC_RUSHCMS_SITE_SLUG,
	cache: {
		enabled: true,
		ttl: 3600
	}
})
