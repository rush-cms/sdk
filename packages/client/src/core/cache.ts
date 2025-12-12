interface CacheEntry<T> {
	data: T
	expiresAt: number
}

export interface CacheConfig {
	enabled: boolean
	ttl: number
}

export class Cache {
	private store: Map<string, CacheEntry<unknown>>

	constructor(private config: CacheConfig) {
		this.store = new Map()
	}

	get(key: string): unknown | null {
		if (!this.config.enabled) {
			return null
		}

		const entry = this.store.get(key)

		if (!entry) {
			return null
		}

		if (entry.expiresAt < Date.now()) {
			this.store.delete(key)
			return null
		}

		return entry.data
	}

	set(key: string, data: unknown): void {
		if (!this.config.enabled) {
			return
		}

		this.store.set(key, {
			data,
			expiresAt: Date.now() + this.config.ttl * 1000
		})
	}

	delete(key: string): void {
		this.store.delete(key)
	}

	clear(): void {
		this.store.clear()
	}

	has(key: string): boolean {
		const entry = this.store.get(key)
		if (!entry) {
			return false
		}

		if (entry.expiresAt < Date.now()) {
			this.store.delete(key)
			return false
		}

		return true
	}
}
