import React, { useState, useEffect } from 'react'
import { Track } from './VibeEngine'
import './TicketPrompt.css'

interface Props {
  track: Track | null
  onGetTickets: (track: Track) => void
}

const TicketPrompt: React.FC<Props> = ({ track, onGetTickets }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (track && !isDismissed) {
      const showDate = new Date(track.show.date)
      const isUpcoming = showDate > new Date()
      
      if (isUpcoming) {
        // Show prompt after 2 seconds of listening to an upcoming show
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, 2000)
        
        return () => clearTimeout(timer)
      }
    }
    
    setIsVisible(false)
  }, [track?.id, isDismissed])

  // Reset dismissed state when track changes
  useEffect(() => {
    setIsDismissed(false)
  }, [track?.id])

  if (!track || !isVisible) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  const handleGetTickets = () => {
    onGetTickets(track)
    setIsDismissed(true)
    setIsVisible(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="ticket-prompt">
      <button className="dismiss-button" onClick={handleDismiss}>×</button>
      
      <div className="prompt-content">
        <div className="prompt-icon">🎫</div>
        <div className="prompt-text">
          <div className="prompt-title">Love this vibe?</div>
          <div className="prompt-subtitle">
            See {track.artist} live at {track.show.venue}
          </div>
          <div className="prompt-date">
            {formatDate(track.show.date)}
          </div>
        </div>
      </div>
      
      <button className="get-tickets-button" onClick={handleGetTickets}>
        Get Tickets
      </button>
    </div>
  )
}

export default TicketPrompt
