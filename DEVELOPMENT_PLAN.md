# 🚀 Vibe-City MVP Development Punch List

## 🎯 Goal: Fast feedback, incremental, verifiable steps to working demo

---

## 📋 Phase 1: Basic Structure & Static UI (30 mins)
**Verifiable Output**: Visual 2D pad that responds to mouse movement

- [ ] Set up basic React/TypeScript project structure
- [ ] Create VibePad component with drag tracking
- [ ] Add emoji hints overlay at corners
- [ ] Style as vintage radio tuner aesthetic
- [ ] Test: Mouse coordinates display in real-time

---

## 📋 Phase 2: Mock Data & Vibe Engine (20 mins)
**Verifiable Output**: Coordinates map to specific tracks

- [ ] Create mock_tracks.json with 4-6 sample tracks
- [ ] Build VibeEngine.ts to find nearest track by [x,y]
- [ ] Connect VibePad to VibeEngine
- [ ] Test: Moving cursor shows different track names

---

## 📋 Phase 3: Audio Playback (25 mins)
**Verifiable Output**: Audio plays and changes with cursor movement

- [ ] Create AudioEngine.ts with Web Audio API
- [ ] Add 4-6 short audio clips (15-30 sec each)
- [ ] Implement basic track switching (no crossfade yet)
- [ ] Test: Different audio plays in different zones

---

## 📋 Phase 4: Smooth Crossfading (20 mins)
**Verifiable Output**: Seamless audio transitions

- [ ] Add crossfade logic to AudioEngine
- [ ] Implement volume ramping between tracks
- [ ] Add "fuzz" static between zones
- [ ] Test: Smooth transitions when dragging

---

## 📋 Phase 5: Now Playing Panel (15 mins)
**Verifiable Output**: Context reveals after interaction

- [ ] Create NowPlaying component
- [ ] Show artist, track, venue info
- [ ] Add reveal animation after 3 seconds
- [ ] Test: Info appears and updates correctly

---

## 📋 Phase 6: Polish & Deploy (10 mins)
**Verifiable Output**: Shareable demo link

- [ ] Add loading states
- [ ] Responsive design tweaks
- [ ] Deploy to static host
- [ ] Test: Works on mobile and desktop

---

## 🎵 Sample Track Coordinates for Testing

```
🌌 Dreamy (0.2, 0.2) - ambient/low energy
🔋 Synthetic High (0.8, 0.2) - electronic/energetic  
🎸 Organic High (0.8, 0.8) - rock/punk/energetic
🧃 Smooth Low (0.2, 0.8) - folk/chill/organic
```

---

## ⚡ Success Criteria
- [ ] Auto-plays on load
- [ ] Cursor movement changes audio
- [ ] 4+ distinct vibe zones work
- [ ] Artist info reveals contextually
- [ ] Demo-ready in under 2 hours
