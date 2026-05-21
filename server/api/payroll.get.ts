// ============================================================================
// API Endpoint: GET /api/payroll
// ============================================================================
import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
    const filePath = resolve('server/data/payroll-deductions.json')
    try {
        const data = readFileSync(filePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Failed to read payroll data:', error)
        return []
    }
})
