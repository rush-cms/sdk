'use client'

import { useState, useEffect } from 'react'
import { LinkPage } from '@rushcms/types'
import { useRushCMS } from '../components/providers/rush-cms-provider'

interface UseLinkPageOptions {
	key: string
	enabled?: boolean
}

interface UseLinkPageResult {
	linkPage: LinkPage | null
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useLinkPage({ key, enabled = true }: UseLinkPageOptions): UseLinkPageResult {
	const { client } = useRushCMS()
	const [linkPage, setLinkPage] = useState<LinkPage | null>(null)
	const [loading, setLoading] = useState(enabled)
	const [error, setError] = useState<Error | null>(null)

	const fetchLinkPage = async () => {
		if (!enabled || !key) return

		try {
			setLoading(true)
			setError(null)
			const response = await client.getLinkPage(key)
			setLinkPage(response.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchLinkPage()
	}, [key, enabled])

	return {
		linkPage,
		loading,
		error,
		refetch: fetchLinkPage
	}
}
