import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useEntry } from './use-entry'
import { RushCMSProvider } from '../components/providers/rush-cms-provider'
import { LocaleProvider } from '../components/providers/locale-provider'
import React from 'react'
import type { ReactNode } from 'react'

const mockClient = {
	getEntry: vi.fn()
}

const createWrapper = (defaultLocale: string = 'en') => {
	return ({ children }: { children: ReactNode }) => (
		<RushCMSProvider client={mockClient as any}>
			<LocaleProvider defaultLocale={defaultLocale as any} availableLocales={['en', 'pt_BR', 'es']}>
				{children}
			</LocaleProvider>
		</RushCMSProvider>
	)
}

describe('useEntry with locale', () => {
	it('should use locale from LocaleProvider context', async () => {
		const mockEntry = { id: 1, title: 'Test Entry', slug: 'test' }
		mockClient.getEntry.mockResolvedValue(mockEntry)

		const wrapper = createWrapper('pt_BR')

		renderHook(() => useEntry({ collectionId: 1, slug: 'test' }), { wrapper })

		await waitFor(() => {
			expect(mockClient.getEntry).toHaveBeenCalledWith(1, 'test', 'pt_BR')
		})
	})

	it('should override context locale with explicit locale parameter', async () => {
		const mockEntry = { id: 1, title: 'Test Entry', slug: 'test' }
		mockClient.getEntry.mockResolvedValue(mockEntry)

		const wrapper = createWrapper('pt_BR')

		renderHook(
			() => useEntry({
				collectionId: 1,
				slug: 'test',
				locale: 'es'
			}),
			{ wrapper }
		)

		await waitFor(() => {
			expect(mockClient.getEntry).toHaveBeenCalledWith(1, 'test', 'es')
		})
	})

	it('should use default locale when no override provided', async () => {
		const mockEntry = { id: 1, title: 'Test Entry', slug: 'test' }
		mockClient.getEntry.mockResolvedValue(mockEntry)

		const wrapper = createWrapper('en')

		renderHook(() => useEntry({ collectionId: 1, slug: 'test' }), { wrapper })

		await waitFor(() => {
			expect(mockClient.getEntry).toHaveBeenCalledWith(1, 'test', 'en')
		})
	})
})
