'use client'

import { useState, useEffect } from 'react'
import { LinkPage } from '@rushcms/types'
import { useRushCMS } from '../components/providers/rush-cms-provider'

interface UseLinkPagesOptions {
	enabled?: boolean
}

interface UseLinkPagesResult {
	linkPages: LinkPage[]
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useLinkPages({ enabled = true }: UseLinkPagesOptions = {}): UseLinkPagesResult {
	const { client } = useRushCMS()
	const [linkPages, setLinkPages] = useState<LinkPage[]>([])
	const [loading, setLoading] = useState(enabled)
	const [error, setError] = useState<Error | null>(null)

	const fetchLinkPages = async () => {
		if (!enabled) return

		try {
			setLoading(true)
			setError(null)
			const response = await client.getLinkPages()
			setLinkPages(response.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchLinkPages()
	}, [enabled])

	return {
		linkPages,
		loading,
		error,
		refetch: fetchLinkPages
	}
}
