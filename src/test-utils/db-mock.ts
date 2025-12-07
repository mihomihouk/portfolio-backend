import { vi, Mock } from 'vitest'

export function setupDatabaseError(db: { query: unknown }) {
  // Make the database throw an error
  ;(db.query as Mock).mockRejectedValue(new Error('Database error'))
  // Suppress console.error output not to pollute the test output
  vi.spyOn(console, 'error').mockImplementation(() => {})
}

export function resetDbMocks(db: { query: unknown }) {
  ;(db.query as Mock).mockReset()
}
