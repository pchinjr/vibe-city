import React, { useState, useEffect } from 'react'
import { Track } from './VibeEngine'
import './NowPlaying.css'

interface Props {
  track: Track | null
  isVisible?: boolean
  onShowDetails?: (track: Track) => void
}

const NowPlaying: React.FC<Props> = ({ track, isVisible = false, onShowDetails }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Reset details when track changes
  useEffect(() => {
    setShowDetails(false)
  }, [track?.id])

  if (!track || !isVisible) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const isUpcoming = date > new Date()
    return {
      formatted: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      isUpcoming
    }
  }

  const dateInfo = formatDate(track.show.date)

  const handleClick = () => {
    setShowDetails(!showDetails)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    setShowDetails(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    // Only hide if not manually clicked
    if (!showDetails) {
      setShowDetails(false)
    }
  }

  return (
    <div 
      className={`now-playing ${showDetails ? 'expanded' : ''} ${isHovering ? 'hovering' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Always visible: Now playing indicator */}
      <div className="now-playing-indicator">
        <div className="vinyl-icon">🎵</div>
        <div className="track-info">
          <div className="track-title">{track.title}</div>
          <div className="artist-name-small">{track.artist}</div>
        </div>
        <div className="expand-hint">
          {showDetails ? '▼' : '▶'}
        </div>
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

          <div className="show-info">
            <div className="show-date">
              📅 {dateInfo.formatted}
            </div>
            <div className="show-venue">
              📍 {track.show.venue}
            </div>
            {track.show.price && (
              <div className="show-price">
                💰 {track.show.price}
              </div>
            )}
            {track.show.description && (
              <div className="show-description">
                {track.show.description}
              </div>
            )}
            {dateInfo.isUpcoming && (
              <div className="upcoming-indicator">🔥 Upcoming Show!</div>
            )}
          </div>

          {/* Call to Action */}
          <button 
            className="get-tickets-cta"
            onClick={(e) => {
              e.stopPropagation()
              onShowDetails?.(track)
            }}
          >
            {dateInfo.isUpcoming ? '🎫 Get Tickets' : '🎵 More Info'}
          </button>

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
