import React, { useState, useRef, useCallback, useEffect } from 'react'
import VibeEngine, { Track, VibeCoordinates } from './VibeEngine'
import AudioEngine from './AudioEngine'
import EmojiHints from './EmojiHints'
import './VibePad.css'

interface Props {
  onTrackChange?: (track: Track | null) => void
}

const VibePad: React.FC<Props> = ({ onTrackChange }) => {
  const [coordinates, setCoordinates] = useState<VibeCoordinates>({ x: 0.5, y: 0.5 })
  const [isDragging, setIsDragging] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [needsUserInteraction, setNeedsUserInteraction] = useState(true)
  const padRef = useRef<HTMLDivElement>(null)

  // Initialize tracks list (but not audio context)
  useEffect(() => {
    const tracks = VibeEngine.getAllTracks()
    AudioEngine.preloadAllTracks(tracks)
    
    // Set initial track for display
    const initialTrack = VibeEngine.findNearestTrack(coordinates)
    if (initialTrack) {
      setCurrentTrack(initialTrack)
      onTrackChange?.(initialTrack)
    }
  }, [])

  // Handle coordinate changes and find nearest track
  useEffect(() => {
    if (!isAudioReady) return

    const nearestTrack = VibeEngine.findNearestTrack(coordinates)
    
    if (nearestTrack !== currentTrack) {
      setCurrentTrack(nearestTrack)
      onTrackChange?.(nearestTrack)
      
      if (nearestTrack) {
        AudioEngine.playTrack(nearestTrack)
      } else {
        AudioEngine.playStatic()
      }
    }
  }, [coordinates, isAudioReady, currentTrack, onTrackChange])

  const updateCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!padRef.current) return

    const rect = padRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    
    setCoordinates({ x, y })
  }, [])

  // Handle first user interaction to initialize audio
  const handleFirstInteraction = async () => {
    if (!needsUserInteraction) return
    
    try {
      await AudioEngine.initializeAfterUserGesture()
      const tracks = VibeEngine.getAllTracks()
      await AudioEngine.loadAllTracksAfterInteraction(tracks)
      
      setNeedsUserInteraction(false)
      setIsAudioReady(true)
      
      // Play initial track
      const initialTrack = VibeEngine.findNearestTrack(coordinates)
      if (initialTrack) {
        await AudioEngine.playTrack(initialTrack)
      }
      
      console.log('Audio system ready!')
    } catch (error) {
      console.error('Failed to initialize audio after user interaction:', error)
    }
  }

  const handleMouseDown = async (e: React.MouseEvent) => {
    await handleFirstInteraction()
    setIsDragging(true)
    updateCoordinates(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateCoordinates(e.clientX, e.clientY)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch events for mobile
  const handleTouchStart = async (e: React.TouchEvent) => {
    await handleFirstInteraction()
    setIsDragging(true)
    const touch = e.touches[0]
    updateCoordinates(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault()
      const touch = e.touches[0]
      updateCoordinates(touch.clientX, touch.clientY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="vibe-pad-container">
      <div 
        ref={padRef}
        className={`vibe-pad ${isDragging ? 'dragging' : ''} ${needsUserInteraction ? 'needs-interaction' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* User interaction prompt */}
        {needsUserInteraction && (
          <div className="interaction-prompt">
            <div className="prompt-text">🎛️ Click or drag to tune in</div>
          </div>
        )}
        
        {/* Crosshair cursor */}
        <div 
          className="vibe-cursor"
          style={{
            left: `${coordinates.x * 100}%`,
            top: `${coordinates.y * 100}%`
          }}
        />
        
        {/* Grid lines for vintage radio feel */}
        <div className="grid-lines">
          {[...Array(5)].map((_, i) => (
            <div key={`h-${i}`} className="grid-line horizontal" style={{ top: `${i * 25}%` }} />
          ))}
          {[...Array(5)].map((_, i) => (
            <div key={`v-${i}`} className="grid-line vertical" style={{ left: `${i * 25}%` }} />
          ))}
        </div>
        
        {/* Emoji hints overlay */}
        <EmojiHints />
      </div>
      
      {/* Debug coordinates */}
      <div className="coordinates-debug">
        <div>Energy: {(1 - coordinates.y).toFixed(2)} (High ↑)</div>
        <div>Texture: {coordinates.x.toFixed(2)} (Synthetic →)</div>
        {needsUserInteraction && (
          <div className="current-track">🎛️ Click or drag to start audio</div>
        )}
        {!needsUserInteraction && currentTrack && (
          <div className="current-track">
            🎵 {currentTrack.artist} - {currentTrack.title}
          </div>
        )}
        {!needsUserInteraction && !currentTrack && isAudioReady && (
          <div className="current-track">📻 Static Zone</div>
        )}
        {!needsUserInteraction && !isAudioReady && (
          <div className="current-track">⏳ Loading audio...</div>
        )}
      </div>
    </div>
  )
}

export default VibePad
