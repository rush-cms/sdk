import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TipTapRenderer } from './tiptap-renderer'
import React from 'react'
import type { TipTapContent } from '@rushcms/types'

describe('TipTapRenderer', () => {
	it('should render paragraph with text', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Hello World'
						}
					]
				}
			]
		}

		render(<TipTapRenderer content={content} />)
		expect(screen.getByText('Hello World')).toBeInTheDocument()
	})

	it('should render heading', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'heading',
					attrs: { level: 2 },
					content: [
						{
							type: 'text',
							text: 'Test Heading'
						}
					]
				}
			]
		}

		render(<TipTapRenderer content={content} />)
		const heading = screen.getByText('Test Heading')
		expect(heading.tagName).toBe('H2')
	})

	it('should render text with bold mark', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Bold Text',
							marks: [{ type: 'bold' }]
						}
					]
				}
			]
		}

		render(<TipTapRenderer content={content} />)
		const strongElement = screen.getByText('Bold Text')
		expect(strongElement.tagName).toBe('STRONG')
	})

	it('should render text with italic mark', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Italic Text',
							marks: [{ type: 'italic' }]
						}
					]
				}
			]
		}

		render(<TipTapRenderer content={content} />)
		const emElement = screen.getByText('Italic Text')
		expect(emElement.tagName).toBe('EM')
	})

	it('should render link', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Click Here',
							marks: [{ type: 'link', attrs: { href: 'https://example.com' } }]
						}
					]
				}
			]
		}

		render(<TipTapRenderer content={content} />)
		const link = screen.getByRole('link')
		expect(link).toHaveAttribute('href', 'https://example.com')
		expect(link).toHaveTextContent('Click Here')
	})

	it('should render bullet list', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'bulletList',
					content: [
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Item 1' }]
								}
							]
						},
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Item 2' }]
								}
							]
						}
					]
				}
			]
		}

		render(<TipTapRenderer content={content} />)
		expect(screen.getByText('Item 1')).toBeInTheDocument()
		expect(screen.getByText('Item 2')).toBeInTheDocument()
	})

	it('should render ordered list', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'orderedList',
					content: [
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'First' }]
								}
							]
						},
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Second' }]
								}
							]
						}
					]
				}
			]
		}

		render(<TipTapRenderer content={content} />)
		expect(screen.getByText('First')).toBeInTheDocument()
		expect(screen.getByText('Second')).toBeInTheDocument()
	})

	it('should render blockquote', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'blockquote',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'Quoted text' }]
						}
					]
				}
			]
		}

		render(<TipTapRenderer content={content} />)
		expect(screen.getByText('Quoted text')).toBeInTheDocument()
	})

	it('should render code block', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'codeBlock',
					attrs: { language: 'javascript' },
					content: [
						{ type: 'text', text: 'const x = 42;' }
					]
				}
			]
		}

		render(<TipTapRenderer content={content} />)
		const code = screen.getByText('const x = 42;')
		expect(code.className).toContain('language-javascript')
	})

	it('should render horizontal rule', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'horizontalRule'
				}
			]
		}

		const { container } = render(<TipTapRenderer content={content} />)
		expect(container.querySelector('hr')).toBeInTheDocument()
	})

	it('should render empty content as null', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: []
		}

		const { container } = render(<TipTapRenderer content={content} />)
		expect(container.firstChild).toBeNull()
	})
})
