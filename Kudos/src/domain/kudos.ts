export type Category =
  | 'TEAMWORK'
  | 'EXTRA_MILE'
  | 'MENTORSHIP'
  | 'CRAFT'
  | 'CUSTOMER_IMPACT'

export const CATEGORIES: Category[] = [
  'TEAMWORK',
  'EXTRA_MILE',
  'MENTORSHIP',
  'CRAFT',
  'CUSTOMER_IMPACT',
]

export interface Kudos {
  id: string
  from: string
  to: string
  message: string
  category: Category
  createdAt: string
  edited?: boolean
}

export const MAX_MESSAGE_LENGTH = 200

export function isValidMessage(message: string): boolean {
  const trimmed = message.trim()
  return trimmed.length > 0 && trimmed.length <= MAX_MESSAGE_LENGTH
}

// Self-kudos are disallowed — a kudos lifts up a colleague, not yourself.
export function canSendKudos(from: string, to: string, message: string): boolean {
  return from !== to && isValidMessage(message)
}

// Only the original sender may edit or delete their own kudos.
export function canModifyKudos(currentUserId: string, kudos: Kudos): boolean {
  return currentUserId === kudos.from
}

export function createKudos(input: {
  from: string
  to: string
  message: string
  category: Category
}): Kudos {
  return {
    id: crypto.randomUUID(),
    from: input.from,
    to: input.to,
    message: input.message.trim(),
    category: input.category,
    createdAt: new Date().toISOString(),
    edited: false,
  }
}

// Edits update message/category only — id, from, to and createdAt never
// change, and no edit timestamp is tracked (only the boolean flag below).
export function updateKudos(
  kudos: Kudos,
  input: { message: string; category: Category },
): Kudos {
  return {
    ...kudos,
    message: input.message.trim(),
    category: input.category,
    edited: true,
  }
}
