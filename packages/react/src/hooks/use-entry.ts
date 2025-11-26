'use client'

import { useState, useEffect } from 'react'
import { Entry } from '@rushcms/types'
import { useRushCMS } from '../components/providers/rush-cms-provider'

interface UseEntryOptions {
	collectionId: number
	slug: string
	enabled?: boolean
}

interface UseEntryResult {
	entry: Entry | null
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useEntry({ collectionId, slug, enabled = true }: UseEntryOptions): UseEntryResult {
	const { client } = useRushCMS()
	const [entry, setEntry] = useState<Entry | null>(null)
	const [loading, setLoading] = useState(enabled)
	const [error, setError] = useState<Error | null>(null)

	const fetchEntry = async () => {
		if (!enabled) return

		try {
			setLoading(true)
			setError(null)
			const data = await client.getEntry(collectionId, slug)
			setEntry(data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchEntry()
	}, [collectionId, slug, enabled])

	return {
		entry,
		loading,
		error,
		refetch: fetchEntry
	}
}
