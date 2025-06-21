import React, { useState, useEffect } from 'react'
import './DemoInstructions.css'

interface Props {
  onDismiss: () => void
}

const DemoInstructions: React.FC<Props> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300) // Wait for animation
  }

  if (!isVisible) return null

  return (
    <div className="demo-instructions-overlay" onClick={handleDismiss}>
      <div className="demo-instructions" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleDismiss}>×</button>
        
        <div className="instructions-header">
          <div className="instructions-icon">🎛️</div>
          <h2>Welcome to Vibe City!</h2>
        </div>
        
        <div className="instructions-content">
          <div className="instruction-step">
            <span className="step-number">1</span>
            <div className="step-text">
              <strong>Click anywhere</strong> to start the audio engine
            </div>
          </div>
          
          <div className="instruction-step">
            <span className="step-number">2</span>
            <div className="step-text">
              <strong>Drag around</strong> the 2D vibe pad to discover music
            </div>
          </div>
          
          <div className="instruction-step">
            <span className="step-number">3</span>
            <div className="step-text">
              <strong>Listen</strong> as tracks crossfade based on your vibe
            </div>
          </div>
          
          <div className="instruction-step">
            <span className="step-number">4</span>
            <div className="step-text">
              <strong>Click "Get Tickets"</strong> when you find something you like
            </div>
          </div>
        </div>
        
        <div className="demo-note">
          <strong>Demo Mode:</strong> Using generated test tones that change pitch and timbre based on Energy (vertical) and Texture (horizontal) coordinates.
        </div>
        
        <button className="start-demo-button" onClick={handleDismiss}>
          Start Demo
        </button>
      </div>
    </div>
  )
}

export default DemoInstructions
