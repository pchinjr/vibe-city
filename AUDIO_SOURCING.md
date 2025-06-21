# 🎵 Audio Sourcing Guide for Vibe-City Demo

## 🎯 What We Need

4 audio clips (15-30 seconds each) representing each quadrant:

1. **🔋 Electric Storm** (High Energy + Synthetic) - Electronic/EDM
2. **🎸 Garage Anthem** (High Energy + Organic) - Rock/Punk  
3. **🌌 Midnight Drift** (Low Energy + Synthetic) - Ambient/Dreamy
4. **🧃 River Folk** (Low Energy + Organic) - Folk/Acoustic

## 🎶 Quick Demo Options (Legal & Free)

### Option 1: Freesound.org (CC Licensed)
- Search for: "electronic loop", "rock riff", "ambient pad", "acoustic guitar"
- Filter by: Creative Commons licenses
- Download as MP3/WAV
- Rename to match our filenames

### Option 2: YouTube Audio Library
- Free music for creators
- Filter by mood/genre
- Download and trim to 15-30 seconds

### Option 3: AI Generated Music
- **Suno.ai** - Generate short clips with prompts like:
  - "Energetic electronic dance music loop"
  - "Raw garage rock guitar riff"
  - "Dreamy ambient synthesizer pad"
  - "Gentle acoustic folk guitar"

### Option 4: Local Chattanooga Artists
- Reach out to local bands for permission
- Use existing recordings (with permission)
- Record new clips specifically for demo

## 🛠️ Quick Setup Script

```bash
# Download and place audio files
cd public/audio

# Option A: Use curl to download from URLs
curl -o electric_storm.wav "YOUR_ELECTRONIC_TRACK_URL"
curl -o garage_anthem.wav "YOUR_ROCK_TRACK_URL"  
curl -o midnight_drift.wav "YOUR_AMBIENT_TRACK_URL"
curl -o river_folk.wav "YOUR_FOLK_TRACK_URL"

# Option B: Use ffmpeg to trim longer tracks and convert to WAV
ffmpeg -i long_track.mp3 -ss 00:00:30 -t 00:00:20 short_clip.wav
```

## 🎨 Audio Characteristics by Quadrant

### 🔋 Electric Storm (0.8 energy, 0.8 texture)
- **BPM**: 120-140
- **Instruments**: Synthesizers, drum machines, electronic beats
- **Mood**: Energetic, driving, synthetic
- **Examples**: House, techno, EDM, synthwave

### 🎸 Garage Anthem (0.8 energy, 0.2 texture)  
- **BPM**: 140-180
- **Instruments**: Electric guitar, drums, bass
- **Mood**: Raw, powerful, organic
- **Examples**: Punk, garage rock, indie rock

### 🌌 Midnight Drift (0.2 energy, 0.8 texture)
- **BPM**: 60-90
- **Instruments**: Synthesizer pads, electronic textures
- **Mood**: Dreamy, atmospheric, synthetic
- **Examples**: Ambient, chillwave, downtempo

### 🧃 River Folk (0.2 energy, 0.2 texture)
- **BPM**: 70-100  
- **Instruments**: Acoustic guitar, soft vocals, organic percussion
- **Mood**: Gentle, warm, organic
- **Examples**: Folk, indie acoustic, singer-songwriter

## ⚡ Fastest Path to Demo

1. **Use Freesound.org** for immediate results
2. Search for each quadrant type
3. Download 4 clips (CC licensed)
4. Rename to match our filenames
5. Test in app immediately

## 🔄 Iteration Strategy

- Start with any 4 clips that roughly fit quadrants
- Test user experience and vibe transitions
- Refine with better audio that matches coordinates exactly
- Eventually replace with local Chattanooga artists
