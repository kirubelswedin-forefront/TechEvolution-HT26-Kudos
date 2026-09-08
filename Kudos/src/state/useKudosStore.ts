import { useCallback, useState } from 'react'
import type { Category, Kudos } from '../domain/kudos'
import { canModifyKudos, canSendKudos, createKudos, updateKudos } from '../domain/kudos'
import { loadKudos, saveKudos } from '../infrastructure/kudosStorage'

interface AddKudosInput {
  from: string
  to: string
  message: string
  category: Category
}

export function useKudosStore() {
  const [kudos, setKudos] = useState<Kudos[]>(() => loadKudos())

  const addKudos = useCallback((input: AddKudosInput) => {
    // Enforced here, not just in the form, so this is the one entry point
    // that can never be bypassed — see domain-model.md "Where does
    // validation live".
    if (!canSendKudos(input.from, input.to, input.message)) return

    setKudos((current) => {
      // Prepend so the list is always newest-first by construction —
      // no sorting needed on render or on load.
      const next = [createKudos(input), ...current]
      saveKudos(next)
      return next
    })
  }, [])

  const editKudos = useCallback(
    (id: string, currentUserId: string, input: { message: string; category: Category }) => {
      if (!input.message.trim()) return

      setKudos((current) => {
        // Re-checked here, not just in the UI, so this can never be
        // bypassed — same rationale as canSendKudos above.
        const next = current.map((item) =>
          item.id === id && canModifyKudos(currentUserId, item) ? updateKudos(item, input) : item,
        )
        saveKudos(next)
        return next
      })
    },
    [],
  )

  const deleteKudos = useCallback((id: string, currentUserId: string) => {
    setKudos((current) => {
      const next = current.filter((item) => !(item.id === id && canModifyKudos(currentUserId, item)))
      saveKudos(next)
      return next
    })
  }, [])

  return { kudos, addKudos, editKudos, deleteKudos }
}
