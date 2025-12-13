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
	const { client, previewData } = useRushCMS()
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

	// Live Preview Override
	// We check if we have preview data for this specific entry (by ID usually, but we might need to match by slug in a real scenario if the preview message sends slug)
	// For now let's assume the preview payload sends the ID.
	// But wait, the hook uses slug. We might not know the ID until we fetch it first.
	// So we can check if the currently fetched entry ID matches any preview data.

	const previewEntry = entry?.id && previewData[`entry:${entry.id}`]
		? (previewData[`entry:${entry.id}`] as Entry)
		: null

	return {
		entry: previewEntry || entry,
		loading,
		error,
		refetch: fetchEntry
	}
}
