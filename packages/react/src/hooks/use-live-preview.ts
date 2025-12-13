'use client'

import { useEffect, useState } from 'react'

interface LivePreviewMessage {
    type: 'rushcms:preview'
    payload: {
        type: 'entry' | 'collection'
        id: number | string
        data: unknown
    }
}

export function useLivePreview() {
    const [previewData, setPreviewData] = useState<Record<string, unknown>>({})

    useEffect(() => {
        if (typeof window === 'undefined') return

        const handler = (event: MessageEvent) => {
            // Validate origin if possible, or check message structure carefully
            const message = event.data as LivePreviewMessage

            if (message?.type === 'rushcms:preview') {
                const key = `${message.payload.type}:${message.payload.id}`
                setPreviewData(prev => ({
                    ...prev,
                    [key]: message.payload.data
                }))
            }
        }

        window.addEventListener('message', handler)
        return () => window.removeEventListener('message', handler)
    }, [])

    return previewData
}
