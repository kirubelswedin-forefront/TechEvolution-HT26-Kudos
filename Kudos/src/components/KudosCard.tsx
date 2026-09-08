import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md'
import type { Category, Kudos } from '../domain/kudos'
import { canModifyKudos, CATEGORIES, isValidMessage, MAX_MESSAGE_LENGTH } from '../domain/kudos'
import { resolveColleagueName, resolveColleagueRole } from '../infrastructure/colleagues'

interface KudosCardProps {
  kudos: Kudos
  currentUserId: string
  onEdit: (id: string, input: { message: string; category: Category }) => void
  onDelete: (id: string) => void
}

function KudosCard({ kudos, currentUserId, onEdit, onDelete }: KudosCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftMessage, setDraftMessage] = useState(kudos.message)
  const [draftCategory, setDraftCategory] = useState<Category>(kudos.category)

  const senderName = resolveColleagueName(kudos.from)
  const recipientName = resolveColleagueName(kudos.to)
  const recipientRole = resolveColleagueRole(kudos.to)
  const sentAt = new Date(kudos.createdAt).toLocaleString()
  const canSave = isValidMessage(draftMessage)
  const canModify = canModifyKudos(currentUserId, kudos)

  function startEditing() {
    setDraftMessage(kudos.message)
    setDraftCategory(kudos.category)
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
  }

  function saveEditing() {
    if (!canSave) return
    onEdit(kudos.id, { message: draftMessage, category: draftCategory })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="kudos-card">
        <p className="kudos-card-people">
          <span className="kudos-card-names">
            <strong>{senderName}</strong> <span aria-hidden="true">&rarr;</span> <strong>{recipientName}</strong>{' '}
            <span className="role-tag">{recipientRole}</span>
          </span>
        </p>

        <label className="field">
          <span className="field-label">Message</span>
          <textarea
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
          />
          <span className="char-counter">
            {draftMessage.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </label>

        <label className="field">
          <span className="field-label">Category</span>
          <select
            value={draftCategory}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setDraftCategory(event.target.value as Category)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <p className="kudos-card-actions">
          <button type="button" className="btn-primary" disabled={!canSave} onClick={saveEditing}>
            Save
          </button>
          <button type="button" className="btn-secondary" onClick={cancelEditing}>
            Cancel
          </button>
        </p>
      </li>
    )
  }

  return (
    <li className="kudos-card">
      <p className="kudos-card-people">
        <span className="kudos-card-names">
          <strong>{senderName}</strong> <span aria-hidden="true">&rarr;</span> <strong>{recipientName}</strong>{' '}
          <span className="role-tag">{recipientRole}</span>
        </span>
        <span className="kudos-card-people-right">
          {kudos.edited && <span className="edited-badge">Edited</span>}
          {canModify && (
            <span className="kudos-card-icon-actions">
              <button type="button" className="icon-btn" aria-label="Edit kudos" onClick={startEditing}>
                <MdOutlineEdit />
              </button>
              <button type="button" className="icon-btn" aria-label="Delete kudos" onClick={() => onDelete(kudos.id)}>
                <MdDeleteOutline />
              </button>
            </span>
          )}
        </span>
      </p>
      <p className="kudos-card-message">{kudos.message}</p>
      <p className="kudos-card-meta">
        <span className="category-badge">{kudos.category}</span>
        <span className="kudos-card-time">{sentAt}</span>
      </p>
    </li>
  )
}

export default KudosCard
