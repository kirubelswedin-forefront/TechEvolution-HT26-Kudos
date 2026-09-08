import { describe, expect, it } from 'vitest'
import { canModifyKudos, canSendKudos, createKudos, isValidMessage, MAX_MESSAGE_LENGTH, updateKudos } from './kudos'

describe('isValidMessage', () => {
  it('rejects an empty message', () => {
    expect(isValidMessage('')).toBe(false)
  })

  it('rejects a whitespace-only message', () => {
    expect(isValidMessage('   \n\t ')).toBe(false)
  })

  it('accepts a normal message', () => {
    expect(isValidMessage('Great work on the deploy!')).toBe(true)
  })

  it(`accepts a message exactly ${MAX_MESSAGE_LENGTH} characters long`, () => {
    expect(isValidMessage('a'.repeat(MAX_MESSAGE_LENGTH))).toBe(true)
  })

  it(`rejects a message longer than ${MAX_MESSAGE_LENGTH} characters`, () => {
    expect(isValidMessage('a'.repeat(MAX_MESSAGE_LENGTH + 1))).toBe(false)
  })
})

describe('canSendKudos', () => {
  it('rejects sending a kudos to yourself', () => {
    expect(canSendKudos('c01', 'c01', 'nice work')).toBe(false)
  })

  it('accepts a valid message to a different colleague', () => {
    expect(canSendKudos('c01', 'c02', 'nice work')).toBe(true)
  })

  it('rejects an invalid message even between different colleagues', () => {
    expect(canSendKudos('c01', 'c02', '   ')).toBe(false)
  })
})

describe('createKudos', () => {
  it('trims the message', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: '  nice work  ', category: 'CRAFT' })

    expect(kudos.message).toBe('nice work')
  })

  it('carries over from, to and category unchanged', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: 'thanks', category: 'MENTORSHIP' })

    expect(kudos.from).toBe('c01')
    expect(kudos.to).toBe('c02')
    expect(kudos.category).toBe('MENTORSHIP')
  })

  it('generates a unique id rather than deriving one from content', () => {
    const first = createKudos({ from: 'c01', to: 'c02', message: 'same message', category: 'CRAFT' })
    const second = createKudos({ from: 'c01', to: 'c02', message: 'same message', category: 'CRAFT' })

    expect(first.id).not.toBe(second.id)
  })

  it('stamps createdAt as a valid ISO date string', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: 'thanks', category: 'CRAFT' })

    expect(new Date(kudos.createdAt).toISOString()).toBe(kudos.createdAt)
  })

  it('is not marked as edited', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: 'thanks', category: 'CRAFT' })

    expect(kudos.edited).toBe(false)
  })
})

describe('updateKudos', () => {
  it('trims the updated message', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: 'thanks', category: 'CRAFT' })

    const updated = updateKudos(kudos, { message: '  updated  ', category: 'CRAFT' })

    expect(updated.message).toBe('updated')
  })

  it('updates the category', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: 'thanks', category: 'CRAFT' })

    const updated = updateKudos(kudos, { message: 'thanks', category: 'TEAMWORK' })

    expect(updated.category).toBe('TEAMWORK')
  })

  it('keeps id, from, to and createdAt unchanged', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: 'thanks', category: 'CRAFT' })

    const updated = updateKudos(kudos, { message: 'updated', category: 'TEAMWORK' })

    expect(updated.id).toBe(kudos.id)
    expect(updated.from).toBe(kudos.from)
    expect(updated.to).toBe(kudos.to)
    expect(updated.createdAt).toBe(kudos.createdAt)
  })

  it('marks the kudos as edited', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: 'thanks', category: 'CRAFT' })

    const updated = updateKudos(kudos, { message: 'updated', category: 'CRAFT' })

    expect(updated.edited).toBe(true)
  })
})

describe('canModifyKudos', () => {
  it('allows the original sender to modify their kudos', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: 'thanks', category: 'CRAFT' })

    expect(canModifyKudos('c01', kudos)).toBe(true)
  })

  it('rejects anyone other than the original sender', () => {
    const kudos = createKudos({ from: 'c01', to: 'c02', message: 'thanks', category: 'CRAFT' })

    expect(canModifyKudos('c02', kudos)).toBe(false)
  })
})
