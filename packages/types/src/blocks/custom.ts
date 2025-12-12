export interface CustomBlock {
    type: `custom_${string}`
    data: Record<string, unknown>
}
