'use client'

import { useState, useEffect } from 'react'
import type { LinkPage, SupportedLocale } from '@rushcms/types'
import { useRushCMS } from '../components/providers/rush-cms-provider'
import { useLocale } from '../components/providers/locale-provider'

interface UseLinkPagesOptions {
	enabled?: boolean
	locale?: SupportedLocale
}

interface UseLinkPagesResult {
	linkPages: LinkPage[]
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useLinkPages({
	enabled = true,
	locale: overrideLocale
}: UseLinkPagesOptions = {}): UseLinkPagesResult {
	const { client } = useRushCMS()
	const { locale: contextLocale } = useLocale()
	const [linkPages, setLinkPages] = useState<LinkPage[]>([])
	const [loading, setLoading] = useState(enabled)
	const [error, setError] = useState<Error | null>(null)

	const activeLocale = overrideLocale || contextLocale

	const fetchLinkPages = async () => {
		if (!enabled) return

		try {
			setLoading(true)
			setError(null)
			const response = await client.getLinkPages(activeLocale)
			setLinkPages(response.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchLinkPages()
	}, [enabled, activeLocale])

	return {
		linkPages,
		loading,
		error,
		refetch: fetchLinkPages
	}
}
