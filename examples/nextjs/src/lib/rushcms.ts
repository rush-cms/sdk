import { RushCMSClient } from '@rushcms/client'

const baseUrl = process.env.NEXT_PUBLIC_RUSHCMS_BASE_URL || 'https://demo.rushcms.com'
const apiToken = process.env.NEXT_PUBLIC_RUSHCMS_API_TOKEN || 'demo-token-replace-with-your-own'
const siteSlug = process.env.NEXT_PUBLIC_RUSHCMS_SITE_SLUG || 'demo-site'

export const rushcmsClient = new RushCMSClient({
	baseUrl,
	apiToken,
	siteSlug,
	cache: {
		enabled: true,
		ttl: 3600
	}
})

