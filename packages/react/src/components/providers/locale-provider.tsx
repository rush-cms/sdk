'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SupportedLocale } from '@rushcms/types'

interface LocaleContextValue {
	locale: SupportedLocale
	setLocale: (locale: SupportedLocale) => void
	availableLocales: SupportedLocale[]
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

interface LocaleProviderProps {
	children: ReactNode
	defaultLocale?: SupportedLocale
	availableLocales?: SupportedLocale[]
}

export function LocaleProvider({
	children,
	defaultLocale = 'en',
	availableLocales = ['en']
}: LocaleProviderProps) {
	const [locale, setLocale] = useState<SupportedLocale>(defaultLocale)

	return (
		<LocaleContext.Provider value={{ locale, setLocale, availableLocales }}>
			{children}
		</LocaleContext.Provider>
	)
}

export function useLocale(): LocaleContextValue {
	const context = useContext(LocaleContext)
	if (!context) {
		throw new Error('useLocale must be used within LocaleProvider')
	}
	return context
}
