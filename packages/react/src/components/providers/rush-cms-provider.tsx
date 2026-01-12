'use client'

import { createContext, useContext } from 'react'
import { RushCMSClient } from '@rushcms/client'
import type { SupportedLocale } from '@rushcms/types'
import { useLivePreview } from '../../hooks/use-live-preview'
import { LocaleProvider } from './locale-provider'

interface RushCMSContextValue {
	client: RushCMSClient
	previewData: Record<string, unknown>
}

const RushCMSContext = createContext<RushCMSContextValue | null>(null)

interface RushCMSProviderProps {
	client: RushCMSClient
	children: React.ReactNode
	defaultLocale?: SupportedLocale
	availableLocales?: SupportedLocale[]
}

export function RushCMSProvider({
	client,
	children,
	defaultLocale = 'en',
	availableLocales = ['en']
}: RushCMSProviderProps) {
	const previewData = useLivePreview()

	return (
		<RushCMSContext.Provider value={{ client, previewData }}>
			<LocaleProvider defaultLocale={defaultLocale} availableLocales={availableLocales}>
				{children}
			</LocaleProvider>
		</RushCMSContext.Provider>
	)
}

export function useRushCMS(): RushCMSContextValue {
	const context = useContext(RushCMSContext)

	if (!context) {
		throw new Error('useRushCMS must be used within a RushCMSProvider')
	}

	return context
}
