'use client'

import { useEntries } from '@rushcms/react'

export default function HomePage() {
	const { data, loading, error } = useEntries(1)

	if (loading) {
		return (
			<main>
				<h1>RushCMS Next.js Example</h1>
				<p>Loading entries...</p>
			</main>
		)
	}

	if (error) {
		return (
			<main>
				<h1>RushCMS Next.js Example</h1>
				<p style={{ color: 'red' }}>Error: {error.message}</p>
				<p>Make sure you have configured your .env.local file with valid credentials.</p>
			</main>
		)
	}

	if (!data || data.data.length === 0) {
		return (
			<main>
				<h1>RushCMS Next.js Example</h1>
				<p>No entries found in collection 1.</p>
				<p>Update the collection ID in src/app/page.tsx to match your RushCMS collection.</p>
			</main>
		)
	}

	return (
		<main>
			<h1>RushCMS Next.js Example</h1>
			<p>Showing {data.data.length} of {data.total} entries from collection 1</p>

			<h2>Entries</h2>
			{data.data.map(entry => (
				<article key={entry.id} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
					<h3>{entry.title}</h3>
					<p><strong>Slug:</strong> {entry.slug}</p>
					<p><strong>Status:</strong> {entry.status}</p>
					<p><strong>Published:</strong> {new Date(entry.published_at).toLocaleDateString()}</p>
					{entry.tags && entry.tags.length > 0 && (
						<p><strong>Tags:</strong> {entry.tags.join(', ')}</p>
					)}
				</article>
			))}

			<div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
				<h3>Next Steps</h3>
				<ul style={{ marginLeft: '1.5rem' }}>
					<li>Update the collection ID to fetch your content</li>
					<li>Use BlockRenderer to render entry blocks</li>
					<li>Explore other hooks like useEntry, useNavigations</li>
					<li>Check the RushCMS documentation for more examples</li>
				</ul>
			</div>
		</main>
	)
}
