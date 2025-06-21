import React, { useState } from 'react'
import VibePad from './components/VibePad'
import NowPlaying from './components/NowPlaying'
import { Track } from './components/VibeEngine'
import './App.css'

function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)

  const handleTrackChange = (track: Track | null) => {
    setCurrentTrack(track)
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
      
      <NowPlaying track={currentTrack} isVisible={true} />
    </div>
  )
}

export default App
