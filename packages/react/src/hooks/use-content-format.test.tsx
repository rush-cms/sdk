import { describe, it, expect } from 'vitest'
import { useContentFormat } from './use-content-format'
import type { Block, TipTapContent } from '@rushcms/types'

describe('useContentFormat', () => {
	it('should detect TipTap content format', () => {
		const tiptapContent: TipTapContent = {
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

		const format = useContentFormat(tiptapContent)
		expect(format).toBe('content-editor')
	})

	it('should detect Block Editor format', () => {
		const blockContent: Block[] = [
			{
				type: 'richtext',
				data: {
					content: '<p>Hello World</p>'
				}
			}
		]

		const format = useContentFormat(blockContent)
		expect(format).toBe('block-editor')
	})

	it('should return unknown for null content', () => {
		const format = useContentFormat(null)
		expect(format).toBe('unknown')
	})

	it('should return unknown for undefined content', () => {
		const format = useContentFormat(undefined)
		expect(format).toBe('unknown')
	})

	it('should return unknown for empty array', () => {
		const format = useContentFormat([])
		expect(format).toBe('unknown')
	})

	it('should return unknown for invalid content', () => {
		const format = useContentFormat({ invalid: 'content' })
		expect(format).toBe('unknown')
	})
})
