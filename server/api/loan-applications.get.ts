// ============================================================================
// API Endpoint: GET /api/loan-applications
// ============================================================================
// Fetches the mock loan applications data from the local JSON file.

import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
    // ============================================================================
    // Data Retrieval
    // ============================================================================
    const filePath = resolve('server/data/loan-applications.json')

    try {
        const data = readFileSync(filePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Failed to read loan applications data:', error)
        return []
    }
})
