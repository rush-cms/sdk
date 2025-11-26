'use client'

import { useState, useEffect } from 'react'
import { Entry, PaginatedResponse, EntriesQueryParams } from '@rushcms/types'
import { useRushCMS } from '../components/providers/rush-cms-provider'

interface UseEntriesOptions {
	collectionId: number
	params?: EntriesQueryParams
	enabled?: boolean
}

interface UseEntriesResult {
	entries: Entry[]
	pagination: PaginatedResponse<Entry> | null
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
	fetchMore: (page: number) => Promise<void>
}

export function useEntries({ collectionId, params, enabled = true }: UseEntriesOptions): UseEntriesResult {
	const { client } = useRushCMS()
	const [pagination, setPagination] = useState<PaginatedResponse<Entry> | null>(null)
	const [loading, setLoading] = useState(enabled)
	const [error, setError] = useState<Error | null>(null)

	const fetchEntries = async (queryParams?: EntriesQueryParams) => {
		if (!enabled) return

		try {
			setLoading(true)
			setError(null)
			const data = await client.getEntries(collectionId, queryParams || params)
			setPagination(data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	const fetchMore = async (page: number) => {
		await fetchEntries({ ...params, page })
	}

	useEffect(() => {
		fetchEntries()
	}, [collectionId, JSON.stringify(params), enabled])

	return {
		entries: pagination?.data || [],
		pagination,
		loading,
		error,
		refetch: () => fetchEntries(),
		fetchMore
	}
}
