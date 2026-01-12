import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContentRenderer } from './content-renderer'
import type { Block, TipTapContent } from '@rushcms/types'


describe('ContentRenderer', () => {
	it('should render TipTap content format', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'TipTap Content'
						}
					]
				}
			]
		}

		render(<ContentRenderer content={content} />)
		expect(screen.getByText('TipTap Content')).toBeInTheDocument()
	})

	it('should render Block Editor content format', () => {
		const content: Block[] = [
			{
				type: 'richtext',
				data: {
					content: {
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Block Editor Content'
									}
								]
							}
						]
					}
				}
			}
		]

		render(<ContentRenderer content={content} />)
		expect(screen.getByText('Block Editor Content')).toBeInTheDocument()
	})


	it('should render null for unknown content format', () => {
		const { container } = render(<ContentRenderer content={{ invalid: 'content' }} />)
		expect(container.firstChild).toBeNull()
	})

	it('should render null for null content', () => {
		const { container } = render(<ContentRenderer content={null} />)
		expect(container.firstChild).toBeNull()
	})

	it('should render null for undefined content', () => {
		const { container } = render(<ContentRenderer content={undefined} />)
		expect(container.firstChild).toBeNull()
	})

	it('should pass className to renderer', () => {
		const content: TipTapContent = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Test'
						}
					]
				}
			]
		}

		const { container } = render(<ContentRenderer content={content} className="custom-class" />)
		expect(container.firstChild).toHaveClass('custom-class')
	})
})
