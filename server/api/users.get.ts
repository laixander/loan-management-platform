// ============================================================================
// API Endpoint: GET /api/users
// ============================================================================
// Fetches the mock user data from the local JSON file.

import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
  // ============================================================================
  // Data Retrieval
  // ============================================================================
  const filePath = resolve('server/data/users.json')
  
  try {
    const data = readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Failed to read users data:', error)
    return []
  }
})
