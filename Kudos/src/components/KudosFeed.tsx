import { Fragment } from 'react'
import type { Kudos } from '../domain/kudos'
import type { Colleague } from '../infrastructure/colleagues'
import { resolveColleagueRole } from '../infrastructure/colleagues'
import type { FeedSortMode } from '../domain/feedSort'
import { sortKudosForDisplay } from '../domain/feedSort'
import EmptyFeed from './EmptyFeed'
import KudosCard from './KudosCard'

interface KudosFeedProps {
  kudos: Kudos[]
  colleagues: Colleague[]
  sortMode: FeedSortMode
  currentUserId: string
  onEdit: (id: string, input: { message: string; category: Kudos['category'] }) => void
  onDelete: (id: string) => void
}

function KudosFeed({ kudos, colleagues, sortMode, currentUserId, onEdit, onDelete }: KudosFeedProps) {
  const sortedKudos = sortKudosForDisplay(kudos, colleagues, sortMode)
  const groupByRole = sortMode.kind === 'role'
  let previousRole: string | null = null

  return (
    <section className="card kudos-feed">
      <h2>Feed</h2>
      {kudos.length === 0 ? (
        <EmptyFeed />
      ) : (
        <ul>
          {sortedKudos.map((item) => {
            const role = resolveColleagueRole(item.to)
            const startsNewGroup = groupByRole && role !== previousRole
            previousRole = role

            return (
              <Fragment key={item.id}>
                {startsNewGroup && (
                  <li className="role-heading">
                    <h3>{role}</h3>
                  </li>
                )}
                <KudosCard kudos={item} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} />
              </Fragment>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default KudosFeed
