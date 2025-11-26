'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@rushcms/types'
import { useRushCMS } from '../components/providers/rush-cms-provider'

interface UseNavigationsOptions {
	enabled?: boolean
}

interface UseNavigationsResult {
	navigations: Navigation[]
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useNavigations({ enabled = true }: UseNavigationsOptions = {}): UseNavigationsResult {
	const { client } = useRushCMS()
	const [navigations, setNavigations] = useState<Navigation[]>([])
	const [loading, setLoading] = useState(enabled)
	const [error, setError] = useState<Error | null>(null)

	const fetchNavigations = async () => {
		if (!enabled) return

		try {
			setLoading(true)
			setError(null)
			const response = await client.getNavigations()
			setNavigations(response.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchNavigations()
	}, [enabled])

	return {
		navigations,
		loading,
		error,
		refetch: fetchNavigations
	}
}
