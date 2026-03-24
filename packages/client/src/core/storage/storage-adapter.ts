export interface StorageAdapter {
	get<T>(key: string): Promise<{ data: T; isStale: boolean } | null>
	set<T>(key: string, data: T, freshTtl?: number, staleTtl?: number): Promise<void>
	invalidate(keyOrPrefix: string): Promise<void>
	delete(key: string): Promise<void>
	clear(): Promise<void>
}
