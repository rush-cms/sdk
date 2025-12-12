import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useEntries } from './use-entries'
import { RushCMSProvider } from '../components/providers/rush-cms-provider'
import React from 'react'

const mockClient = {
    getEntries: vi.fn()
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RushCMSProvider client={mockClient as any}>
        {children}
    </RushCMSProvider>
)

describe('useEntries', () => {
    it('should return data on success', async () => {
        const mockData = {
            data: [{ id: 1, title: 'Post' }],
            meta: {},
            links: {}
        }

        mockClient.getEntries.mockResolvedValue(mockData)

        const { result } = renderHook(() => useEntries({ collectionId: 1 }), { wrapper })

        expect(result.current.loading).toBe(true)

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.entries).toEqual(mockData.data)
    })

    it('should handle errors', async () => {
        mockClient.getEntries.mockRejectedValue(new Error('API Error'))

        const { result } = renderHook(() => useEntries({ collectionId: 1 }), { wrapper })

        await waitFor(() => {
            expect(result.current.error).toBeTruthy()
        })
    })
})
