import type { Block } from '../blocks'

export interface Homepage {
    id: number
    content: Block[]
    meta: {
        title: string
        description: string
        [key: string]: unknown
    }
    updated_at: string
}
