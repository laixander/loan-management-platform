// ============================================================================
// API Endpoint: GET /api/repayments
// ============================================================================
import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
    const filePath = resolve('server/data/repayments.json')
    try {
        const data = readFileSync(filePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Failed to read repayments data:', error)
        return []
    }
})
