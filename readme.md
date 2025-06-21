# 🎶 vibe-city – Project Summary & Onboarding Demo Guide

## 🧭 Project Summary

**VibeCity** is a vibe-first local music discovery app for Chattanooga. Instead of browsing by artist, genre, or calendar, users *tune into vibes* using a 2D sonic map based on **Energy** and **Texture**. Each coordinate in this space represents a song from a local artist. The UI is skeuomorphic, inspired by a vintage radio tuner with “fuzz” in between sonic zones.
**VibeCity** is a vibe-first local music discovery app for Chattanooga. Instead of browsing by artist, genre, or calendar, users *tune into vibes* using a 2D sonic map based on **Energy** and **Texture**. Each coordinate in this space represents a song from a local artist. The UI is skeuomorphic, inspired by a vintage radio tuner with "fuzz" in between sonic zones.

## ✅ Recent Updates

- **Audio Context Fix**: Resolved browser autoplay policy issues by deferring AudioContext initialization until user interaction
- **User Experience**: Added visual prompts and animations to guide users to interact with the interface
- **Error Handling**: Improved audio loading with graceful fallbacks and better error messages
---

## 🎯 Core Concept for Demo

When the user lands:

1. A short clip from a local band begins to play.
2. The user sees a **2D tuner interface** and drags their cursor to change the vibe.
3. Tracks smoothly crossfade as they move through the space.
4. Emojis hint at vibe zones (e.g. 🌌 dreamy, 🎸 rowdy, 🧃 smooth).
5. A floating drawer reveals band/show info *after discovery*.

---

# 📐 UI Wireframe Overview (Onboarding Demo)

## 🖥️ Main Screen Layout

```
+----------------------------------------------------+
|                                                    |
|        🌀     🌌     🔋     🎸     🧃     💀        |
|                                                    |
|    +------------------------------------------+    |
|    |                                          |    |
|    |      🎛️  2D VibePad                      |    |
|    |      (drag to change vibe)              |    |
|    |                                          |    |
|    +------------------------------------------+    |
|                                                    |
|   🎶 Now Playing: “...”      📍 Venue: “...”       |
|                                                    |
+----------------------------------------------------+
```

---

# 🔧 Implementation Guide for Q

## 🗂️ App Structure

```
/app
  /components
    VibePad.tsx          ← 2D controller
    AudioEngine.ts       ← handles playback + crossfade
    VibeEngine.ts        ← gets nearest track to [x, y]
    EmojiHints.tsx       ← emoji quadrant overlay
    NowPlaying.tsx       ← artist & show reveal panel
  /data
    mock_tracks.json     ← seed audio clips + [energy, texture]
  index.tsx              ← entry point
```

---

## 🧱 Component Breakdown

### `VibePad.tsx`

* Render a full-size div with drag tracking.
* Return coordinates in `[0, 1]` space.
* Feed that into `VibeEngine`.

### `VibeEngine.ts`

* Given `[x, y]` → finds the closest matching track in `mock_tracks.json` using Euclidean distance.
* Adds a "fuzz zone" (no match within radius = static noise).

### `AudioEngine.ts`

* Loads and buffers audio clips.
* Smooth crossfade when switching.
* Adds optional static/fuzz FX between zones.

### `EmojiHints.tsx`

* Place emoji icons at the 4 corners or around the edges of the 2D pad:

  * 🌌 (dreamy/synthetic/low energy)
  * 🔋 (high energy/synthetic)
  * 🎸 (high energy/organic)
  * 🧃 (low energy/organic)

### `NowPlaying.tsx`

* Hidden by default.
* Reveals after X seconds of listening or on hover/tap.
* Shows artist name, vibe tags, upcoming show.

---

## 📦 Mock Data

**`mock_tracks.json`**

```json
[
  {
    "id": "1",
    "title": "Night Surf",
    "artist": "Sun Rail Revival",
    "audioUrl": "/audio/sun_rail.mp3",
    "energy": 0.3,
    "texture": 0.7,
    "tags": ["dreamy", "folk", "ambient"],
    "show": {
      "date": "2025-06-28",
      "venue": "Barking Legs Theater"
    }
  }
]
```

---

## 🛠️ Tech Stack

* Frontend: **TypeScript + React (or Preact)**
* Audio: **Web Audio API**
* Hosting: **Deno Deploy or Static Host**
* Data: **Local JSON files (for now)**

---

## ✅ Hackathon Onboarding Goals

* [ ] Launches directly into music
* [ ] User can drag and change vibe
* [ ] Audio crossfades between clips
* [ ] Emojis visually reinforce vibes
* [ ] “Now Playing” shows contextual info
* [ ] Works offline from local `mock_tracks.json`
