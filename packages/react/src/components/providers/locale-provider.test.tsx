import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { LocaleProvider, useLocale } from './locale-provider'
import React from 'react'
import type { ReactNode } from 'react'

describe('LocaleProvider', () => {
	it('should provide default locale', () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<LocaleProvider>{children}</LocaleProvider>
		)

		const { result } = renderHook(() => useLocale(), { wrapper })

		expect(result.current.locale).toBe('en')
		expect(result.current.availableLocales).toEqual(['en'])
	})

	it('should provide custom default locale', () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<LocaleProvider defaultLocale='pt_BR' availableLocales={['en', 'pt_BR', 'es']}>
				{children}
			</LocaleProvider>
		)

		const { result } = renderHook(() => useLocale(), { wrapper })

		expect(result.current.locale).toBe('pt_BR')
		expect(result.current.availableLocales).toEqual(['en', 'pt_BR', 'es'])
	})

	it('should allow locale changes', () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<LocaleProvider defaultLocale='en' availableLocales={['en', 'pt_BR']}>
				{children}
			</LocaleProvider>
		)

		const { result } = renderHook(() => useLocale(), { wrapper })

		expect(result.current.locale).toBe('en')

		act(() => {
			result.current.setLocale('pt_BR')
		})

		expect(result.current.locale).toBe('pt_BR')
	})

	it('should throw error when useLocale is used outside LocaleProvider', () => {
		expect(() => {
			renderHook(() => useLocale())
		}).toThrow('useLocale must be used within LocaleProvider')
	})

	it('should render children correctly', () => {
		render(
			<LocaleProvider>
				<div>Test Content</div>
			</LocaleProvider>
		)

		expect(screen.getByText('Test Content')).toBeInTheDocument()
	})

	it('should maintain locale state across multiple useLocale calls', () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<LocaleProvider defaultLocale='en' availableLocales={['en', 'pt_BR']}>
				{children}
			</LocaleProvider>
		)

		const { result: result1 } = renderHook(() => useLocale(), { wrapper })
		const { result: result2 } = renderHook(() => useLocale(), { wrapper })

		act(() => {
			result1.current.setLocale('pt_BR')
		})

		expect(result2.current.locale).toBe('pt_BR')
	})
})
