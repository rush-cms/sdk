'use client'

import { createContext, useContext } from 'react'
import { RushCMSClient } from '@rushcms/client'
import { useLivePreview } from '../../hooks/use-live-preview'

interface RushCMSContextValue {
	client: RushCMSClient
	previewData: Record<string, unknown>
}

const RushCMSContext = createContext<RushCMSContextValue | null>(null)

interface RushCMSProviderProps {
	client: RushCMSClient
	children: React.ReactNode
}

export function RushCMSProvider({ client, children }: RushCMSProviderProps) {
	const previewData = useLivePreview()

	return (
		<RushCMSContext.Provider value={{ client, previewData }}>
			{children}
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
