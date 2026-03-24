import type { StorageAdapter } from './storage-adapter'

interface CacheEntry<T> {
	data: T
	freshUntil: number
	validUntil: number
}

export class MemoryStorageAdapter implements StorageAdapter {
	private store = new Map<string, CacheEntry<unknown>>()

	async get<T>(key: string): Promise<{ data: T; isStale: boolean } | null> {
		const entry = this.store.get(key)
		if (!entry) return null

		if (Date.now() > entry.validUntil) {
			this.store.delete(key)
			return null
		}

		return {
			data: entry.data as T,
			isStale: Date.now() > entry.freshUntil
		}
	}

	async set<T>(key: string, data: T, freshTtl: number = 60, staleTtl: number = 300): Promise<void> {
		const now = Date.now()
		this.store.set(key, {
			data,
			freshUntil: now + freshTtl * 1000,
			validUntil: now + staleTtl * 1000
		})
	}

	async invalidate(keyOrPrefix: string): Promise<void> {
		for (const key of this.store.keys()) {
			if (key.startsWith(keyOrPrefix)) {
				this.store.delete(key)
			}
		}
	}

	async delete(key: string): Promise<void> {
		this.store.delete(key)
	}

	async clear(): Promise<void> {
		this.store.clear()
	}
}
