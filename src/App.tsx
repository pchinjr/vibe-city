import React, { useState } from 'react'
import VibePad from './components/VibePad'
import EmojiHints from './components/EmojiHints'
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
        <EmojiHints />
      </main>
      
      <footer className="now-playing">
        <span>
          {currentTrack 
            ? `🎶 Now Playing: ${currentTrack.artist} - ${currentTrack.title}`
            : '🎶 Now Playing: Drag to discover...'
          }
        </span>
        <span>
          {currentTrack 
            ? `📍 Venue: ${currentTrack.show.venue} (${currentTrack.show.date})`
            : '📍 Venue: ---'
          }
        </span>
      </footer>
    </div>
  )
}

export default App
