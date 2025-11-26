'use client'

import { createContext, useContext } from 'react'
import { RushCMSClient } from '@rushcms/client'

interface RushCMSContextValue {
	client: RushCMSClient
}

const RushCMSContext = createContext<RushCMSContextValue | null>(null)

interface RushCMSProviderProps {
	client: RushCMSClient
	children: React.ReactNode
}

export function RushCMSProvider({ client, children }: RushCMSProviderProps) {
	return (
		<RushCMSContext.Provider value={{ client }}>
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
