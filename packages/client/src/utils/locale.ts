import type { SupportedLocale, LOCALE_NAMES } from '@rushcms/types'

export class LocaleUtils {
	/**
	 * Normalize locale string (pt-BR → pt_BR)
	 */
	static normalizeLocale(locale: string): SupportedLocale {
		return locale.replace('-', '_') as SupportedLocale
	}

	/**
	 * Detect browser locale
	 */
	static detectBrowserLocale(): SupportedLocale {
		if (typeof navigator === 'undefined') return 'en'

		const browserLang = navigator.language || 'en'
		return LocaleUtils.normalizeLocale(browserLang)
	}

	/**
	 * Get locale display name
	 */
	static getLocaleName(locale: SupportedLocale): string {
		const names: typeof LOCALE_NAMES = {
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

		return names[locale] || locale
	}

	/**
	 * Check if a string is a valid locale
	 */
	static isValidLocale(locale: string): locale is SupportedLocale {
		const valid: SupportedLocale[] = [
			'en',
			'pt_BR',
			'es',
			'fr',
			'de',
			'it',
			'ja',
			'zh_CN',
			'zh_TW'
		]
		return valid.includes(locale as SupportedLocale)
	}

	/**
	 * Get short locale code (pt_BR → pt)
	 */
	static getShortLocale(locale: SupportedLocale): string {
		return locale.split('_')[0]
	}
}
