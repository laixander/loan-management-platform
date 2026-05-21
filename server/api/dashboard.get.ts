// ============================================================================
// API Endpoint: GET /api/dashboard
// ============================================================================
// Fetches the mock loan dashboard data from the local JSON file.

import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
    // ============================================================================
    // Data Retrieval
    // ============================================================================
    const filePath = resolve('server/data/dashboard.json')

    try {
        const data = readFileSync(filePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Failed to read dashboard data:', error)
        return null
    }
})
