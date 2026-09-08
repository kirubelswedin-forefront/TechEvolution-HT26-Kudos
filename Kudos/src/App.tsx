import { useState } from 'react'
import { useKudosStore } from './state/useKudosStore'
import { useCurrentUser } from './state/useCurrentUser'
import { colleagues } from './infrastructure/colleagues'
import { DEFAULT_FEED_SORT_MODE } from './domain/feedSort'
import type { FeedSortMode } from './domain/feedSort'
import KudosForm from './components/KudosForm'
import KudosFeed from './components/KudosFeed'
import FeedSortControl from './components/FeedSortControl'
import NeedsKudosSection from './components/NeedsKudosSection'

function App() {
  const { kudos, addKudos, editKudos, deleteKudos } = useKudosStore()
  const { currentUserId, setCurrentUserId } = useCurrentUser(colleagues[0]?.id ?? '')
  const [sortMode, setSortMode] = useState<FeedSortMode>(DEFAULT_FEED_SORT_MODE)

  return (
    <>
      <header className="app-header">
        <h1>Kudos Wall</h1>
        <p>Short, public shoutouts between colleagues.</p>
      </header>
      <main className="app-content">
        <KudosForm onSend={addKudos} currentUserId={currentUserId} onCurrentUserChange={setCurrentUserId} />
        <FeedSortControl sortMode={sortMode} onChange={setSortMode} />
        <KudosFeed
          kudos={kudos}
          colleagues={colleagues}
          sortMode={sortMode}
          currentUserId={currentUserId}
          onEdit={(id, input) => editKudos(id, currentUserId, input)}
          onDelete={(id) => deleteKudos(id, currentUserId)}
        />
        <NeedsKudosSection colleagues={colleagues} kudos={kudos} />
      </main>
    </>
  )
}

export default App
