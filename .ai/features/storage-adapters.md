# Storage Adapters

## Overview
The Storage Adapter system allows the `RushCMSClient` to use any persistent storage mechanism for caching API responses. This replaces the legacy in-memory Map cache with a flexible interface.

## How it works
The SDK uses the `StorageAdapter` interface:

```typescript
export interface StorageAdapter {
    get<T>(key: string): Promise<T | null>
    set<T>(key: string, value: T, ttl?: number): Promise<void>
    delete(key: string): Promise<void>
    clear(): Promise<void>
}
```

By default, the SDK uses `MemoryStorageAdapter`, which stores data in memory (ideal for client-side or serverless environments where persistence isn't required across requests).

## Usage

### Using the default adapter
```typescript
const client = new RushCMSClient({
    token: 'YOUR_TOKEN'
    // uses MemoryStorageAdapter automagically
})
```

### Implementing a custom adapter (e.g., Redis)
```typescript
import { StorageAdapter, RushCMSClient } from '@rushcms/client'
import Redis from 'ioredis'

class RedisAdapter implements StorageAdapter {
    private redis = new Redis()

    async get<T>(key: string) {
        const data = await this.redis.get(key)
        return data ? JSON.parse(data) : null
    }

    async set<T>(key: string, value: T, ttl?: number) {
        if (ttl) {
            await this.redis.set(key, JSON.stringify(value), 'EX', ttl)
        } else {
            await this.redis.set(key, JSON.stringify(value))
        }
    }
    
    // ... implement delete and clear
}

const client = new RushCMSClient({
    token: 'YOUR_TOKEN',
    storage: new RedisAdapter()
})
```
