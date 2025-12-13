import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useLivePreview } from './use-live-preview'

describe('useLivePreview', () => {
    const originalAddEventListener = window.addEventListener
    const originalRemoveEventListener = window.removeEventListener

    afterEach(() => {
        window.addEventListener = originalAddEventListener
        window.removeEventListener = originalRemoveEventListener
    })

    it('should update state on valid message', () => {
        const { result } = renderHook(() => useLivePreview())

        act(() => {
            window.dispatchEvent(new MessageEvent('message', {
                data: {
                    type: 'rushcms:preview',
                    payload: {
                        type: 'entry',
                        id: 1,
                        data: {
                            id: 1,
                            title: 'Updated Title'
                        }
                    }
                }
            }))
        })

        expect(result.current['entry:1']).toEqual({
            id: 1,
            title: 'Updated Title'
        })
    })

    it('should ignore invalid messages', () => {
        const { result } = renderHook(() => useLivePreview())

        act(() => {
            window.dispatchEvent(new MessageEvent('message', {
                data: {
                    type: 'other:event',
                    payload: {}
                }
            }))
        })

        expect(result.current).toEqual({})
    })
})
