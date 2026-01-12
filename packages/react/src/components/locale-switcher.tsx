'use client'

import { useLocale } from './providers/locale-provider'
import { LocaleUtils } from '@rushcms/client'

interface LocaleSwitcherProps {
	className?: string
	showNames?: boolean
}

export function LocaleSwitcher({ className, showNames = true }: LocaleSwitcherProps) {
	const { locale, setLocale, availableLocales } = useLocale()

	return (
		<select
			value={locale}
			onChange={(e) => setLocale(e.target.value as any)}
			className={className}
		>
			{availableLocales.map((loc) => (
				<option key={loc} value={loc}>
					{showNames ? LocaleUtils.getLocaleName(loc) : loc}
				</option>
			))}
		</select>
	)
}
