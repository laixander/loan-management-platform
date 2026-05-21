// ============================================================================
// API Endpoint: GET /api/approvals
// ============================================================================
import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
    const filePath = resolve('server/data/approvals.json')
    try {
        const data = readFileSync(filePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Failed to read approvals data:', error)
        return []
    }
})
