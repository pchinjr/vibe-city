import React, { useState, useEffect } from 'react'
import { Track } from './VibeEngine'
import './NowPlaying.css'

interface Props {
  track: Track | null
  isVisible?: boolean
}

const NowPlaying: React.FC<Props> = ({ track, isVisible = false }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [autoShowTimer, setAutoShowTimer] = useState<NodeJS.Timeout | null>(null)

  // Auto-show details after 3 seconds of listening to the same track
  useEffect(() => {
    if (track && isVisible) {
      // Clear existing timer
      if (autoShowTimer) {
        clearTimeout(autoShowTimer)
      }
      
      // Set new timer
      const timer = setTimeout(() => {
        setShowDetails(true)
      }, 3000)
      
      setAutoShowTimer(timer)
    } else {
      // Clear timer if no track or not visible
      if (autoShowTimer) {
        clearTimeout(autoShowTimer)
        setAutoShowTimer(null)
      }
      setShowDetails(false)
    }

    // Cleanup on unmount
    return () => {
      if (autoShowTimer) {
        clearTimeout(autoShowTimer)
      }
    }
  }, [track?.id, isVisible])

  if (!track || !isVisible) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div 
      className={`now-playing ${showDetails ? 'expanded' : ''}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Always visible: Now playing indicator */}
      <div className="now-playing-indicator">
        <div className="vinyl-icon">🎵</div>
        <div className="track-title">{track.title}</div>
      </div>

      {/* Expandable details */}
      {showDetails && (
        <div className="track-details">
          <div className="artist-name">{track.artist}</div>
          
          <div className="vibe-tags">
            {track.tags.map((tag, index) => (
              <span key={index} className="vibe-tag">
                {tag}
              </span>
            ))}
          </div>

          {track.show && (
            <div className="show-info">
              <div className="show-date">
                📅 {formatDate(track.show.date)}
              </div>
              <div className="show-venue">
                📍 {track.show.venue}
              </div>
            </div>
          )}

          <div className="vibe-coordinates">
            <div className="coordinate">
              Energy: {(track.energy * 100).toFixed(0)}%
            </div>
            <div className="coordinate">
              Texture: {(track.texture * 100).toFixed(0)}% synthetic
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NowPlaying
