'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@rushcms/types'
import { useRushCMS } from '../components/providers/rush-cms-provider'

interface UseNavigationOptions {
	key: string
	enabled?: boolean
}

interface UseNavigationResult {
	navigation: Navigation | null
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useNavigation({ key, enabled = true }: UseNavigationOptions): UseNavigationResult {
	const { client } = useRushCMS()
	const [navigation, setNavigation] = useState<Navigation | null>(null)
	const [loading, setLoading] = useState(enabled)
	const [error, setError] = useState<Error | null>(null)

	const fetchNavigation = async () => {
		if (!enabled || !key) return

		try {
			setLoading(true)
			setError(null)
			const response = await client.getNavigation(key)
			setNavigation(response.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchNavigation()
	}, [key, enabled])

	return {
		navigation,
		loading,
		error,
		refetch: fetchNavigation
	}
}
