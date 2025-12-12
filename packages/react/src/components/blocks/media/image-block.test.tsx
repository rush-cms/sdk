import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageBlock } from './image-block'
import React from 'react'
import type { ImageBlock as ImageBlockType } from '@rushcms/types'

const mockBlock: ImageBlockType = {
    type: 'image',
    data: {
        image: 'https://example.com/image.jpg',
        alt: 'Test Image',
        caption: 'Test Caption',
        alignment: 'center',
        size: 'medium',
        aspect_ratio: 'auto',
        border_radius: 'none',
        lazy_loading: true,
        lightbox: false,
        shadow: false,
        link_new_tab: false
    }
}

describe('ImageBlock', () => {
    it('should render image with correct attributes', () => {
        render(<ImageBlock block={mockBlock} />)

        const img = screen.getByRole('img')
        expect(img).toHaveAttribute('src', mockBlock.data.image)
        expect(img).toHaveAttribute('alt', 'Test Image')
    })

    it('should render caption if provided', () => {
        render(<ImageBlock block={mockBlock} />)

        expect(screen.getByText('Test Caption')).toBeInTheDocument()
    })
})
