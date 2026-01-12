'use client'

import { useEntries } from '@rushcms/react'
import type { Entry } from '@rushcms/types'

export default function HomePage() {
	const { entries, pagination, loading, error } = useEntries({ collectionId: 1 })

	if (loading) {
		return (
			<main className='min-h-screen p-8'>
				<h1 className='text-4xl font-bold mb-4'>RushCMS Next.js Example</h1>
				<p>Loading entries...</p>
			</main>
		)
	}

	if (error) {
		return (
			<main className='min-h-screen p-8'>
				<h1 className='text-4xl font-bold mb-4'>RushCMS Next.js Example</h1>
				<p className='text-red-600'>Error: {error.message}</p>
				<p>Make sure you have configured your .env.local file with valid credentials.</p>
			</main>
		)
	}

	if (!entries || entries.length === 0) {
		return (
			<main className='min-h-screen p-8'>
				<h1 className='text-4xl font-bold mb-4'>RushCMS Next.js Example</h1>
				<p>No entries found in collection 1.</p>
				<p>Update the collection ID in page.tsx to match your RushCMS collection.</p>
			</main>
		)
	}

	return (
		<main className='min-h-screen p-8'>
			<h1 className='text-4xl font-bold mb-4'>RushCMS Next.js Example</h1>
			<p className='mb-8'>Showing {entries.length} of {pagination?.meta.total || entries.length} entries from collection 1</p>

			<h2 className='text-2xl font-bold mb-4'>Entries</h2>
			<div className='space-y-4'>
				{entries.map((entry: Entry) => (
					<article key={entry.id} className='p-4 border rounded-lg'>
						<h3 className='text-xl font-semibold'>{entry.title}</h3>
						<p><strong>Slug:</strong> {entry.slug}</p>
						<p><strong>Status:</strong> {entry.status}</p>
						<p><strong>Published:</strong> {new Date(entry.published_at).toLocaleDateString()}</p>
						{entry.tags && entry.tags.length > 0 && (
							<p><strong>Tags:</strong> {entry.tags.join(', ')}</p>
						)}
					</article>
				))}
			</div>

			<div className='mt-8 p-4 bg-gray-100 rounded-lg'>
				<h3 className='text-xl font-bold mb-2'>Next Steps</h3>
				<ul className='list-disc list-inside space-y-1'>
					<li>Update the collection ID to fetch your content</li>
					<li>Use BlockRenderer to render entry blocks</li>
					<li>Explore other hooks like useEntry, useNavigations</li>
					<li>Check the RushCMS documentation for more examples</li>
				</ul>
			</div>
		</main>
	)
}
