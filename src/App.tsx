import React, { useState } from 'react'
import VibePad from './components/VibePad'
import NowPlaying from './components/NowPlaying'
import ShowDetails from './components/ShowDetails'
import TicketPrompt from './components/TicketPrompt'
import DemoInstructions from './components/DemoInstructions'
import { Track } from './components/VibeEngine'
import './App.css'

function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)

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

  const handleDismissInstructions = () => {
    setShowInstructions(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎶 Vibe City</h1>
        <p>Tune into Chattanooga's sound</p>
        <div className="demo-notice">
          🎵 Demo Mode: Using generated test tones
        </div>
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
      
      {showInstructions && (
        <DemoInstructions onDismiss={handleDismissInstructions} />
      )}
    </div>
  )
}

export default App
