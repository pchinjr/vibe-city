import React, { useState } from 'react'
import { Track } from './VibeEngine'
import './ShowDetails.css'

interface Props {
  track: Track | null
  isVisible: boolean
  onClose: () => void
}

const ShowDetails: React.FC<Props> = ({ track, isVisible, onClose }) => {
  const [isTicketLoading, setIsTicketLoading] = useState(false)

  if (!track || !isVisible) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const isUpcoming = date > new Date()
    
    return {
      formatted: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      isUpcoming
    }
  }

  const handleGetTickets = async () => {
    setIsTicketLoading(true)
    
    // Simulate ticket lookup/redirect
    setTimeout(() => {
      // In a real app, this would redirect to ticketing platform
      const ticketUrl = `https://www.eventbrite.com/e/search?q=${encodeURIComponent(track.artist + ' ' + track.show.venue)}`
      window.open(ticketUrl, '_blank')
      setIsTicketLoading(false)
    }, 1000)
  }

  const handleGetDirections = () => {
    const query = encodeURIComponent(`${track.show.venue} Chattanooga TN`)
    const mapsUrl = `https://maps.google.com/maps?q=${query}`
    window.open(mapsUrl, '_blank')
  }

  const handleAddToCalendar = () => {
    const startDate = new Date(track.show.date)
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000) // 3 hours later
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(track.artist + ' Live')}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${encodeURIComponent(`See ${track.artist} live at ${track.show.venue}! Discovered on Vibe City.`)}&location=${encodeURIComponent(track.show.venue + ', Chattanooga, TN')}`
    
    window.open(calendarUrl, '_blank')
  }

  const dateInfo = formatDate(track.show.date)

  return (
    <div className="show-details-overlay" onClick={onClose}>
      <div className="show-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="show-header">
          <div className="artist-name">{track.artist}</div>
          <div className="track-title">"{track.title}"</div>
        </div>

        <div className="show-info-section">
          <div className="show-date">
            <div className="date-main">{dateInfo.formatted}</div>
            <div className="date-time">Doors at 8:00 PM • Show at 9:00 PM</div>
            {!dateInfo.isUpcoming && (
              <div className="date-past">This show has already happened</div>
            )}
          </div>

          <div className="venue-info">
            <div className="venue-name">📍 {track.show.venue}</div>
            <div className="venue-address">Chattanooga, TN</div>
          </div>
        </div>

        <div className="vibe-preview">
          <div className="vibe-title">You discovered this vibe:</div>
          <div className="vibe-tags">
            {track.tags.map((tag, index) => (
              <span key={index} className="vibe-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="vibe-coords">
            Energy: {Math.round(track.energy * 100)}% • 
            Texture: {Math.round(track.texture * 100)}% synthetic
          </div>
        </div>

        {dateInfo.isUpcoming ? (
          <div className="action-buttons">
            <button 
              className="primary-button get-tickets"
              onClick={handleGetTickets}
              disabled={isTicketLoading}
            >
              {isTicketLoading ? (
                <>🎫 Finding Tickets...</>
              ) : (
                <>🎫 Get Tickets</>
              )}
            </button>
            
            <div className="secondary-actions">
              <button className="secondary-button" onClick={handleAddToCalendar}>
                📅 Add to Calendar
              </button>
              <button className="secondary-button" onClick={handleGetDirections}>
                🗺️ Get Directions
              </button>
            </div>
          </div>
        ) : (
          <div className="past-show-actions">
            <div className="past-show-message">
              This show already happened, but check out their other music!
            </div>
            <button 
              className="secondary-button"
              onClick={() => window.open(`https://open.spotify.com/search/${encodeURIComponent(track.artist)}`, '_blank')}
            >
              🎵 Listen on Spotify
            </button>
          </div>
        )}

        <div className="discovery-note">
          <div className="note-text">
            💡 Found this through vibe discovery? Share your experience!
          </div>
          <button 
            className="share-button"
            onClick={() => {
              const shareText = `Just discovered ${track.artist} on Vibe City! Seeing them at ${track.show.venue} 🎶`
              if (navigator.share) {
                navigator.share({ text: shareText })
              } else {
                navigator.clipboard.writeText(shareText)
                alert('Copied to clipboard!')
              }
            }}
          >
            📱 Share Discovery
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShowDetails
