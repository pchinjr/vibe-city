import React, { useState } from 'react'
import VibePad from './components/VibePad'
import NowPlaying from './components/NowPlaying'
import ShowDetails from './components/ShowDetails'
import TicketPrompt from './components/TicketPrompt'
import { Track } from './components/VibeEngine'
import './App.css'

function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  const handleTrackChange = (track: Track | null) => {
    setCurrentTrack(track)
  }

  const handleShowDetails = (track: Track) => {
    setSelectedTrack(track)
    setShowDetailsModal(true)
  }

  const handleCloseDetails = () => {
    setShowDetailsModal(false)
    setSelectedTrack(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎶 Vibe City</h1>
        <p>Tune into Chattanooga's sound</p>
      </header>
      
      <main className="vibe-container">
        <VibePad onTrackChange={handleTrackChange} />
      </main>
      
      <NowPlaying 
        track={currentTrack} 
        isVisible={true} 
        onShowDetails={handleShowDetails}
      />
      
      <TicketPrompt 
        track={currentTrack}
        onGetTickets={handleShowDetails}
      />
      
      <ShowDetails 
        track={selectedTrack}
        isVisible={showDetailsModal}
        onClose={handleCloseDetails}
      />
    </div>
  )
}

export default App
