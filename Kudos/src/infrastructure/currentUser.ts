const STORAGE_KEY = 'kudos-wall:current-user'

export function loadCurrentUser(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function saveCurrentUser(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch (error) {
    // Same rationale as kudosStorage: don't let storage failures crash the app.
    console.error('Failed to save current user to localStorage', error)
  }
}
