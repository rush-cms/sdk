'use client'

import { useState, useEffect } from 'react'
import type { LinkPage, SupportedLocale } from '@rushcms/types'
import { useRushCMS } from '../components/providers/rush-cms-provider'
import { useLocale } from '../components/providers/locale-provider'

interface UseLinkPageOptions {
	key: string
	enabled?: boolean
	locale?: SupportedLocale
}

interface UseLinkPageResult {
	linkPage: LinkPage | null
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useLinkPage({
	key,
	enabled = true,
	locale: overrideLocale
}: UseLinkPageOptions): UseLinkPageResult {
	const { client } = useRushCMS()
	const { locale: contextLocale } = useLocale()
	const [linkPage, setLinkPage] = useState<LinkPage | null>(null)
	const [loading, setLoading] = useState(enabled)
	const [error, setError] = useState<Error | null>(null)

	const activeLocale = overrideLocale || contextLocale

	const fetchLinkPage = async () => {
		if (!enabled || !key) return

		try {
			setLoading(true)
			setError(null)
			const response = await client.getLinkPage(key, activeLocale)
			setLinkPage(response.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchLinkPage()
	}, [key, enabled, activeLocale])

	return {
		linkPage,
		loading,
		error,
		refetch: fetchLinkPage
	}
}
