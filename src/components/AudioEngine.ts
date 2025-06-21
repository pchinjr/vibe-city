import { Track } from './VibeEngine'

class AudioEngine {
  private audioContext: AudioContext | null = null
  private currentSource: AudioBufferSourceNode | null = null
  private currentGain: GainNode | null = null
  private nextSource: AudioBufferSourceNode | null = null
  private nextGain: GainNode | null = null
  private audioBuffers: Map<string, AudioBuffer> = new Map()
  private isInitialized = false
  private userHasInteracted = false
  private currentTrackId: string | null = null

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Resume context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }
      
      this.isInitialized = true
      console.log('AudioEngine initialized')
    } catch (error) {
      console.error('Failed to initialize AudioEngine:', error)
    }
  }

  // Call this on first user interaction
  async initializeAfterUserGesture(): Promise<void> {
    if (this.userHasInteracted) return
    
    this.userHasInteracted = true
    await this.initialize()
  }

  async loadTrack(track: Track): Promise<void> {
    if (!this.audioContext || this.audioBuffers.has(track.id)) return

    try {
      console.log(`Loading track: ${track.title}`)
      
      // Try to load actual audio file - attempt multiple formats
      const audioBuffer = await this.tryLoadAudioFile(track)
      if (audioBuffer) {
        this.audioBuffers.set(track.id, audioBuffer)
        console.log(`Loaded: ${track.title}`)
        return
      }
      
      // If no audio file found, create a simple placeholder tone
      console.log(`No audio file found for ${track.title}, creating placeholder`)
      const placeholderBuffer = this.createPlaceholderTone(track)
      this.audioBuffers.set(track.id, placeholderBuffer)
      
    } catch (error) {
      console.error(`Failed to load track ${track.title}:`, error)
      // Create a silent buffer as fallback
      const silentBuffer = this.generateSilentBuffer()
      this.audioBuffers.set(track.id, silentBuffer)
    }
  }

  // Try to load audio file in multiple formats
  private async tryLoadAudioFile(track: Track): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null

    // Extract base filename without extension
    const basePath = track.audioUrl.replace(/\.[^/.]+$/, "")
    
    // Try common audio formats in order of preference
    const formats = ['wav', 'mp3', 'm4a', 'ogg', 'flac']
    
    for (const format of formats) {
      try {
        const url = `${basePath}.${format}`
        console.log(`Trying: ${url}`)
        
        const response = await fetch(url)
        if (response.ok && response.status === 200) {
          const arrayBuffer = await response.arrayBuffer()
          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
          console.log(`✅ Found and loaded: ${url}`)
          return audioBuffer
        }
      } catch (error) {
        // Continue to next format
        console.log(`❌ Failed to load ${basePath}.${format}`)
      }
    }
    
    console.log(`No audio file found for ${track.title} in any supported format`)
    return null
  }

  // Create a simple placeholder tone (much simpler than before)
  private createPlaceholderTone(track: Track): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized')
    
    const duration = 3 // 3 seconds
    const sampleRate = this.audioContext.sampleRate
    const numSamples = sampleRate * duration
    
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
    const data = buffer.getChannelData(0)
    
    // Simple sine wave based on track energy
    const frequency = 200 + (track.energy * 200) // 200-400 Hz
    
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      
      // Simple envelope
      let envelope = 1
      const fadeTime = 0.1
      if (t < fadeTime) {
        envelope = t / fadeTime
      } else if (t > duration - fadeTime) {
        envelope = (duration - t) / fadeTime
      }
      
      // Simple sine wave
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.1
    }
    
    return buffer
  }

  // Generate a silent buffer as ultimate fallback
  private generateSilentBuffer(): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized')
    
    const duration = 1 // 1 second of silence
    const sampleRate = this.audioContext.sampleRate
    const numSamples = sampleRate * duration
    
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
    // Buffer is already filled with zeros (silence)
    
    return buffer
  }

  async playTrack(track: Track): Promise<void> {
    // Ensure audio context is initialized
    if (!this.audioContext) {
      console.warn('AudioContext not initialized - user interaction required')
      return
    }

    // Don't restart the same track
    if (this.currentTrackId === track.id) {
      return
    }

    // Load track if not already loaded
    if (!this.audioBuffers.has(track.id)) {
      await this.loadTrack(track)
    }

    const audioBuffer = this.audioBuffers.get(track.id)
    if (!audioBuffer) return

    // Crossfade to new track
    await this.crossfadeToTrack(audioBuffer, track.id)

    console.log(`Playing: ${track.title}`)
  }

  private async crossfadeToTrack(audioBuffer: AudioBuffer, trackId: string): Promise<void> {
    if (!this.audioContext) return

    const crossfadeDuration = 0.5 // 500ms crossfade
    const currentTime = this.audioContext.currentTime

    // Create new source and gain for the incoming track
    this.nextSource = this.audioContext.createBufferSource()
    this.nextGain = this.audioContext.createGain()

    // Connect: source -> gain -> destination
    this.nextSource.buffer = audioBuffer
    this.nextSource.connect(this.nextGain)
    this.nextGain.connect(this.audioContext.destination)

    // Start new track at 0 volume
    this.nextGain.gain.setValueAtTime(0, currentTime)
    this.nextSource.loop = true
    this.nextSource.start()

    // Fade in new track
    this.nextGain.gain.linearRampToValueAtTime(0.7, currentTime + crossfadeDuration)

    // Fade out current track if it exists
    if (this.currentGain && this.currentSource) {
      this.currentGain.gain.linearRampToValueAtTime(0, currentTime + crossfadeDuration)
      
      // Stop old track after fade out
      setTimeout(() => {
        if (this.currentSource) {
          try {
            this.currentSource.stop()
          } catch (error) {
            // Source might already be stopped
          }
        }
      }, crossfadeDuration * 1000 + 100) // Add small buffer
    }

    // Swap references
    this.currentSource = this.nextSource
    this.currentGain = this.nextGain
    this.currentTrackId = trackId
    this.nextSource = null
    this.nextGain = null
  }

  stopCurrentTrack(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop()
      } catch (error) {
        // Source might already be stopped
      }
      this.currentSource = null
    }
    if (this.nextSource) {
      try {
        this.nextSource.stop()
      } catch (error) {
        // Source might already be stopped
      }
      this.nextSource = null
    }
    this.currentGain = null
    this.nextGain = null
    this.currentTrackId = null
  }

  // Play static/fuzz when in dead zones
  playStatic(): void {
    if (!this.audioContext) return

    // Don't restart static if already playing
    if (this.currentTrackId === 'static') return

    this.stopCurrentTrack()

    // Create filtered white noise (more pleasant than pure white noise)
    const bufferSize = this.audioContext.sampleRate * 1 // 1 second
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // Generate filtered white noise
    for (let i = 0; i < bufferSize; i++) {
      const t = i / this.audioContext.sampleRate
      
      // Create filtered noise (less harsh than pure white noise)
      let noise = (Math.random() * 2 - 1) * 0.08 // Lower volume
      
      // Apply simple low-pass filtering by averaging with previous samples
      if (i > 0) {
        noise = (noise + data[i - 1] * 0.3) / 1.3
      }
      
      // Add some subtle modulation to make it more radio-like
      const modulation = Math.sin(2 * Math.PI * t * 2) * 0.02
      noise *= (1 + modulation)
      
      data[i] = noise
    }

    this.currentSource = this.audioContext.createBufferSource()
    this.currentGain = this.audioContext.createGain()

    this.currentSource.buffer = buffer
    this.currentSource.connect(this.currentGain)
    this.currentGain.connect(this.audioContext.destination)

    this.currentGain.gain.setValueAtTime(0.2, this.audioContext.currentTime) // Even lower volume
    this.currentSource.loop = true
    this.currentSource.start()
    this.currentTrackId = 'static'

    console.log('Playing static')
  }

  setVolume(volume: number): void {
    if (this.currentGain && this.audioContext) {
      this.currentGain.gain.setValueAtTime(volume, this.audioContext.currentTime)
    }
  }

  // Preload all tracks for smooth experience - but don't initialize AudioContext yet
  async preloadAllTracks(tracks: Track[]): Promise<void> {
    // Don't initialize AudioContext here - wait for user interaction
    console.log('Tracks ready for loading after user interaction')
  }

  // Load tracks after user interaction
  async loadAllTracksAfterInteraction(tracks: Track[]): Promise<void> {
    if (!this.audioContext) {
      console.warn('AudioContext not initialized')
      return
    }
    
    const loadPromises = tracks.map(track => this.loadTrack(track))
    await Promise.all(loadPromises)
    
    console.log('All tracks loaded')
  }
}

export default new AudioEngine()
