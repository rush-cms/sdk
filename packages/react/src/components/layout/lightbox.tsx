'use client'

import { useEffect } from 'react'

interface LightboxProps {
	isOpen: boolean
	onClose: () => void
	imageSrc: string
	imageAlt?: string
	caption?: string
}

export function Lightbox({ isOpen, onClose, imageSrc, imageAlt, caption }: LightboxProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4'
			onClick={onClose}
		>
			<button
				onClick={onClose}
				className='absolute top-4 right-4 text-white hover:text-gray-300 transition-colors'
				aria-label='Close lightbox'
			>
				<svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
				</svg>
			</button>
			<div onClick={(e) => e.stopPropagation()} className='max-w-7xl max-h-full'>
				<img
					src={imageSrc}
					alt={imageAlt}
					className='max-w-full max-h-[90vh] object-contain'
				/>
				{caption && (
					<p className='text-white text-center mt-4'>{caption}</p>
				)}
			</div>
		</div>
	)
}
