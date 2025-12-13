import type { StorageAdapter } from './storage-adapter'

interface CacheItem<T> {
    value: T
    expiry: number
}

export class MemoryStorageAdapter implements StorageAdapter {
    private store = new Map<string, CacheItem<unknown>>()

    async get<T>(key: string): Promise<T | null> {
        const item = this.store.get(key)
        if (!item) return null

        if (Date.now() > item.expiry) {
            this.store.delete(key)
            return null
        }

        return item.value as T
    }

    async set<T>(key: string, value: T, ttl: number = 7200): Promise<void> {
        this.store.set(key, {
            value,
            expiry: Date.now() + ttl * 1000
        })
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key)
    }

    async clear(): Promise<void> {
        this.store.clear()
    }
}
