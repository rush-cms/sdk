/**
 * Supported locales in Rush CMS
 */
export type SupportedLocale = 'en' | 'pt_BR' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh_CN' | 'zh_TW'

/**
 * Locale configuration for a site
 */
export interface LocaleConfig {
	enabled: SupportedLocale[]
	default: SupportedLocale
	fallback: SupportedLocale
}

/**
 * Request options that include locale
 */
export interface LocaleAwareRequest {
	locale?: SupportedLocale
}

/**
 * Response that includes locale information
 */
export interface LocaleAwareResponse {
	locale?: SupportedLocale
	available_locales?: SupportedLocale[]
}

/**
 * Locale display names
 */
export const LOCALE_NAMES: Record<SupportedLocale, string> = {
	en: 'English',
	pt_BR: 'Português (Brasil)',
	es: 'Español',
	fr: 'Français',
	de: 'Deutsch',
	it: 'Italiano',
	ja: '日本語',
	zh_CN: '简体中文',
	zh_TW: '繁體中文'
}
