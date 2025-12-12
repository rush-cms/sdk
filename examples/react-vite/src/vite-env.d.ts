/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_RUSHCMS_BASE_URL: string
	readonly VITE_RUSHCMS_API_TOKEN: string
	readonly VITE_RUSHCMS_SITE_SLUG: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
