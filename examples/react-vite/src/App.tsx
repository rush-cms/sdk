import { useEntries } from '@rushcms/react'
import type { Entry } from '@rushcms/types'

function App() {
	const { entries, pagination, loading, error } = useEntries({ collectionId: 1 })

	if (loading) {
		return (
			<main>
				<h1>RushCMS React + Vite Example</h1>
				<p>Loading entries...</p>
			</main>
		)
	}

	if (error) {
		return (
			<main>
				<h1>RushCMS React + Vite Example</h1>
				<p style={{ color: 'red' }}>Error: {error.message}</p>
				<p>Make sure you have configured your .env.local file with valid credentials.</p>
			</main>
		)
	}

	if (!entries || entries.length === 0) {
		return (
			<main>
				<h1>RushCMS React + Vite Example</h1>
				<p>No entries found in collection 1.</p>
				<p>Update the collection ID in src/App.tsx to match your RushCMS collection.</p>
			</main>
		)
	}

	return (
		<main>
			<h1>RushCMS React + Vite Example</h1>
			<p>Showing {entries.length} of {pagination?.meta.total || entries.length} entries from collection 1</p>

			<h2>Entries</h2>
			{entries.map((entry: Entry) => (
				<article key={entry.id} className="entry-card">
					<h3>{entry.title}</h3>
					<p><strong>Slug:</strong> {entry.slug}</p>
					<p><strong>Status:</strong> {entry.status}</p>
					<p><strong>Published:</strong> {new Date(entry.published_at).toLocaleDateString()}</p>
					{entry.tags && entry.tags.length > 0 && (
						<p><strong>Tags:</strong> {entry.tags.join(', ')}</p>
					)}
				</article>
			))}

			<div className="next-steps">
				<h3>Next Steps</h3>
				<ul>
					<li>Update the collection ID to fetch your content</li>
					<li>Use BlockRenderer to render entry blocks</li>
					<li>Explore other hooks like useEntry, useNavigations</li>
					<li>Check the RushCMS documentation for more examples</li>
				</ul>
			</div>
		</main>
	)
}

export default App

