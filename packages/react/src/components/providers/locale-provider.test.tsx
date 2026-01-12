import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { LocaleProvider, useLocale } from './locale-provider'
import React from 'react'
import type { ReactNode } from 'react'
import type { SupportedLocale } from '@rushcms/types'


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
		let locale1: SupportedLocale = 'en'
		let locale2: SupportedLocale = 'en'
		let setLocaleFunc: ((locale: SupportedLocale) => void) | null = null

		function TestComponent() {
			const hook1 = useLocale()
			const hook2 = useLocale()
			
			locale1 = hook1.locale
			locale2 = hook2.locale
			setLocaleFunc = hook1.setLocale
			
			return null
		}

		render(
			<LocaleProvider defaultLocale='en' availableLocales={['en', 'pt_BR']}>
				<TestComponent />
			</LocaleProvider>
		)

		expect(locale1).toBe('en')
		expect(locale2).toBe('en')

		act(() => {
			setLocaleFunc!('pt_BR')
		})

		expect(locale1).toBe('pt_BR')
		expect(locale2).toBe('pt_BR')
	})

})
