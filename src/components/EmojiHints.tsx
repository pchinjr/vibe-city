import React from 'react'
import './EmojiHints.css'

const EmojiHints: React.FC = () => {
  return (
    <div className="emoji-hints">
      {/* Top Left: High Energy + Organic */}
      <div className="emoji-hint top-left">
        <span className="emoji">🎸</span>
        <span className="label">rowdy</span>
      </div>
      
      {/* Top Right: High Energy + Synthetic */}
      <div className="emoji-hint top-right">
        <span className="emoji">🔋</span>
        <span className="label">electric</span>
      </div>
      
      {/* Bottom Left: Low Energy + Organic */}
      <div className="emoji-hint bottom-left">
        <span className="emoji">🧃</span>
        <span className="label">smooth</span>
      </div>
      
      {/* Bottom Right: Low Energy + Synthetic */}
      <div className="emoji-hint bottom-right">
        <span className="emoji">🌌</span>
        <span className="label">dreamy</span>
      </div>
      
      {/* Axis labels */}
      <div className="axis-label energy-high">High Energy</div>
      <div className="axis-label energy-low">Low Energy</div>
      <div className="axis-label texture-organic">Organic</div>
      <div className="axis-label texture-synthetic">Synthetic</div>
    </div>
  )
}

export default EmojiHints
