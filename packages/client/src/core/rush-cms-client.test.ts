import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RushCMSClient } from './rush-cms-client'
import { RushCMSNotFoundError } from './errors'
import { MemoryStorageAdapter } from './storage/memory-adapter'

const mockConfig = {
    baseUrl: 'https://api.rushcms.com',
    apiToken: 'test-token',
    siteSlug: 'test-site'
}

describe('RushCMSClient', () => {
    let client: RushCMSClient

    beforeEach(() => {
        client = new RushCMSClient(mockConfig)
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('should instantiate correctly', () => {
        expect(client).toBeInstanceOf(RushCMSClient)
    })

    it('should fetch entries correctly', async () => {
        const mockResponse = {
            data: [{ id: 1, title: 'Test Entry' }],
            meta: { total: 1 }
        }

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
            status: 200
        } as Response)

        const result = await client.getEntries(1)

        expect(fetch).toHaveBeenCalledWith(
            'https://api.rushcms.com/api/v1/test-site/collections/1/entries',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': 'Bearer test-token'
                })
            })
        )
        expect(result).toEqual(mockResponse)
    })

    it('should fetch homepage correctly', async () => {
        const mockResponse = {
            data: { id: 1, content: [] }
        }

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
            status: 200
        } as Response)

        const result = await client.getHomepage()

        expect(fetch).toHaveBeenCalledWith(
            'https://api.rushcms.com/api/v1/test-site/homepage',
            expect.any(Object)
        )
        expect(result).toEqual(mockResponse)
    })

    it('should throw RushCMSNotFoundError on 404', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: async () => ({})
        } as Response)

        await expect(client.getEntries(1)).rejects.toThrow(RushCMSNotFoundError)
    })

    it('should use cache if enabled', async () => {
        const mockResponse = { data: [] }

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
            status: 200
        } as Response)

        // First call
        await client.getEntries(1)

        // Second call should not trigger fetch
        await client.getEntries(1)

        expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should use custom storage adapter', async () => {
        const storage = new MemoryStorageAdapter()
        const spy = vi.spyOn(storage, 'get')

        client = new RushCMSClient({
            ...mockConfig,
            storage
        })

        const mockResponse = { data: [] }
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
            status: 200
        } as Response)

        await client.getEntries(1)
        expect(spy).toHaveBeenCalled()
    })

    it('should log debug messages when debug is enabled', async () => {
        const consoleSpy = vi.spyOn(console, 'log')
        client = new RushCMSClient({
            ...mockConfig,
            debug: true
        })

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] }),
            status: 200
        } as Response)

        await client.getEntries(1)
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[RushCMS]'), expect.anything())
    })

    describe('Locale functionality', () => {
        it('should use default locale from config', () => {
            client = new RushCMSClient({
                ...mockConfig,
                locale: {
                    default: 'pt_BR',
                    fallback: 'en'
                }
            })

            expect(client.getLocale()).toBe('pt_BR')
        })

        it('should default to "en" if no locale config provided', () => {
            expect(client.getLocale()).toBe('en')
        })

        it('should set and get locale', () => {
            client.setLocale('pt_BR')
            expect(client.getLocale()).toBe('pt_BR')

            client.setLocale('es')
            expect(client.getLocale()).toBe('es')
        })

        it('should send Accept-Language header with current locale', async () => {
            client.setLocale('pt_BR')

            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: async () => ({ data: [] }),
                status: 200
            } as Response)

            await client.getEntries(1)

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Accept-Language': 'pt_BR'
                    })
                })
            )
        })

        it('should update Accept-Language header when locale changes', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: async () => ({ data: [] }),
                status: 200
            } as Response)

            client.setLocale('en')
            await client.getEntries(1)

            expect(fetch).toHaveBeenLastCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Accept-Language': 'en'
                    })
                })
            )

            client.setLocale('pt_BR')
            await client.getEntries(1)

            expect(fetch).toHaveBeenLastCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Accept-Language': 'pt_BR'
                    })
                })
            )
        })

        it('should log locale change when debug is enabled', () => {
            const consoleSpy = vi.spyOn(console, 'log')
            client = new RushCMSClient({
                ...mockConfig,
                debug: true
            })

            client.setLocale('pt_BR')

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('[RushCMS] Locale changed to: pt_BR'),
                expect.anything()
            )
        })
    })
})
