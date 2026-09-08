import { useCallback, useState } from 'react'
import { loadCurrentUser, saveCurrentUser } from '../infrastructure/currentUser'

// There's no real login — this is a lightweight "who am I" identity used
// only to gate editing/deleting to the original sender.
export function useCurrentUser(defaultUserId: string) {
  const [currentUserId, setCurrentUserIdState] = useState<string>(() => loadCurrentUser() ?? defaultUserId)

  const setCurrentUserId = useCallback((id: string) => {
    setCurrentUserIdState(id)
    saveCurrentUser(id)
  }, [])

  return { currentUserId, setCurrentUserId }
}
