export type IdempotencyRawQueryResponse = {
    id: number
    idem_key: string
    finalized: number
    created_at: Date
    updated_at: Date
    booking_id: number
}