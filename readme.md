# 🎶 Vibe City – Local Music Discovery for Chattanooga

## 🧭 Project Overview

**Vibe City** is a revolutionary music discovery app that lets users explore Chattanooga's local music scene through **vibes** instead of traditional browsing. Using a 2D sonic map based on **Energy** (high/low) and **Texture** (organic/synthetic), users drag across a vintage radio-inspired interface to discover music that matches their current mood.

## ✨ Current Status: **FULLY FUNCTIONAL MVP**

### 🎯 Complete Feature Set:
- ✅ **2D Vibe Discovery**: Smooth audio crossfading as users explore the sonic map
- ✅ **Real Event Integration**: Live show data with ticket purchasing
- ✅ **Interactive Show Details**: Click/hover to see artist info, venues, and pricing
- ✅ **Direct Ticket Links**: One-click access to Eventbrite, Ticketmaster, and venue sites
- ✅ **Calendar Integration**: Add shows to Google Calendar
- ✅ **Venue Directions**: Instant Google Maps integration
- ✅ **Social Sharing**: Share discoveries with friends
- ✅ **Mobile-Responsive**: Works seamlessly on all devices

## 🎵 How It Works

### **Discovery Flow:**
1. **Land & Listen** → App immediately starts playing local music
2. **Drag to Explore** → Move cursor/finger across the 2D vibe pad
3. **Find Your Vibe** → Audio smoothly crossfades between tracks
4. **Discover Details** → Click now-playing area to see show info
5. **Get Tickets** → Direct links to purchase tickets for upcoming shows

### **Vibe Mapping:**
- **Y-Axis (Energy)**: High energy (top) ↔ Low energy (bottom)  
- **X-Axis (Texture)**: Organic/acoustic (left) ↔ Synthetic/electronic (right)
- **Emoji Hints**: Visual cues guide users to different vibe zones
- **Fuzz Zones**: Areas between tracks create authentic radio tuning experience

---

## 🏗️ Technical Architecture

### **Frontend Stack:**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Web Audio API** for seamless audio crossfading
- **CSS3** with custom animations and responsive design

### **Project Structure:**
```
/src
  /components
    VibePad.tsx          ← 2D vibe controller with drag interaction
    AudioEngine.ts       ← Web Audio API management & crossfading
    VibeEngine.ts        ← Track discovery logic & coordinate mapping
    NowPlaying.tsx       ← Interactive track info display
    ShowDetails.tsx      ← Full event details modal
    TicketPrompt.tsx     ← Floating ticket purchase prompts
    EmojiHints.tsx       ← Visual vibe zone indicators
  /data
    mock_tracks.json     ← Track data with vibe coordinates & show info
    event_data.json      ← Real Chattanooga event data
  /services
    EventDataService.ts  ← Data abstraction layer (API-ready)
```

### **Key Components:**

#### **VibePad.tsx**
- Handles mouse/touch drag interactions
- Converts screen coordinates to vibe space (0-1 range)
- Manages user interaction states and audio initialization
- Responsive design for mobile and desktop

#### **AudioEngine.ts** 
- Web Audio API implementation with buffer management
- Smooth crossfading between tracks (500ms transitions)
- CORS-enabled audio loading with error handling
- Optimized for performance with audio buffer caching

#### **VibeEngine.ts**
- Euclidean distance calculation for nearest track discovery
- Configurable "fuzz zones" for authentic radio experience
- Async data loading with EventDataService integration
- Track filtering and search capabilities

#### **NowPlaying.tsx**
- Click-to-expand interface for user control
- Hover preview with visual feedback
- Real-time show information display
- Integrated ticket purchase flow

---

## 🎪 Current Artists & Shows

### **Live Event Integration:**
- **Dexter Bell & Friends** @ Barking Legs (Jazz/Smooth)
- **Cowboy Mouth** @ Barrelhouse Ballroom (High-Energy Rock)
- **Heavy Valley** @ Cherry St. Tavern (Atmospheric Indie)
- **Vitamin String Quartet** @ Memorial & Walker Theatre (Classical)
- **Call Me Spinster** @ The Honest Pint (Local Indie/Alternative)

### **Vibe Coordinates:**
```
High Energy, Synthetic    🔋 Electronic/Dance
High Energy, Organic      🎸 Rock/Punk  
Low Energy, Synthetic     🌌 Ambient/Dreamy
Low Energy, Organic       🧃 Folk/Acoustic
```

---

## 🚀 Getting Started

### **Prerequisites:**
- Node.js 18+
- npm or yarn

### **Installation:**
```bash
git clone [repository-url]
cd vibe-city
npm install
```

### **Development:**
```bash
npm run dev
# Opens at http://localhost:5173
```

### **Audio Files Setup:**
Place audio files in `/public/audio/`:
- `electric_storm.wav`
- `garage_anthem.mp3`
- `midnight_drift.wav`
- `river_folk.wav`
- `potholes_preview.wav`

### **Build for Production:**
```bash
npm run build
npm run preview
```

---

## 🔮 Future Roadmap

### **Phase 1: Enhanced Discovery**
- [ ] More granular vibe coordinates (sub-genres)
- [ ] User preference learning
- [ ] Playlist generation from vibe sessions
- [ ] Advanced audio effects (reverb, filters)

### **Phase 2: Real-Time Data**
- [ ] Live event API integration (Eventbrite, Ticketmaster)
- [ ] Spotify/Apple Music preview integration
- [ ] Real-time show updates and notifications
- [ ] Dynamic pricing and availability

### **Phase 3: Community Features**
- [ ] User accounts and saved vibes
- [ ] Social sharing and recommendations
- [ ] Artist submission portal
- [ ] User-generated vibe tags

### **Phase 4: Advanced Features**
- [ ] AI-powered vibe matching
- [ ] Live show streaming integration
- [ ] Venue partnership program
- [ ] Mobile app (React Native)

---

## 🎨 Design Philosophy

### **Skeuomorphic Radio Interface:**
- Vintage radio tuner aesthetic with modern functionality
- Tactile drag interactions that feel like tuning a real radio
- Visual feedback with grid lines and analog-style indicators
- Warm color palette inspired by classic audio equipment

### **Vibe-First Discovery:**
- Prioritizes emotional connection over metadata
- Encourages serendipitous discovery through exploration
- Reduces decision paralysis with intuitive spatial navigation
- Creates memorable experiences through audio-visual harmony

---

## 🛠️ Development Notes

### **Audio Implementation:**
- Uses Web Audio API for precise timing and crossfading
- Handles browser autoplay policies with user interaction detection
- Optimized buffer management for smooth performance
- Fallback error handling for unsupported audio formats

### **Data Architecture:**
- EventDataService abstracts data sources for easy API integration
- Mock data structure matches real API response formats
- Async loading with proper error handling
- Scalable for hundreds of tracks and events

### **Performance Optimizations:**
- Lazy loading of audio buffers
- Efficient coordinate-to-track mapping algorithms
- Debounced drag events to prevent excessive calculations
- CSS transforms for smooth animations

---

## 📱 Browser Support

- **Chrome/Edge**: Full support with Web Audio API
- **Firefox**: Full support with Web Audio API  
- **Safari**: Full support (requires user interaction for audio)
- **Mobile Safari/Chrome**: Optimized touch interactions

---

## 🤝 Contributing

This project is designed for easy extension and modification:

1. **Adding New Tracks**: Update `mock_tracks.json` with vibe coordinates
2. **New Event Sources**: Extend `EventDataService.ts` with additional APIs
3. **UI Enhancements**: Components are modular and well-documented
4. **Audio Effects**: AudioEngine supports additional Web Audio nodes

---

## 📄 License

MIT License - Feel free to use this project as inspiration for your own music discovery applications.

---

**Built with ❤️ for the Chattanooga music community**
