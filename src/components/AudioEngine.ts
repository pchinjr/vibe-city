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
      console.log(`Loading track from URL: ${track.title}`)
      
      // Handle both local files and remote URLs
      const audioUrl = track.audioUrl.startsWith('http') 
        ? track.audioUrl 
        : track.audioUrl // Local files stay as-is
      
      const response = await fetch(audioUrl, {
        mode: 'cors', // Enable CORS for remote URLs
        headers: {
          'Accept': 'audio/*'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status} - ${response.statusText}`)
      }
      
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      
      this.audioBuffers.set(track.id, audioBuffer)
      console.log(`✅ Loaded from URL: ${track.title} (${audioBuffer.duration}s)`)
      
    } catch (error) {
      console.error(`Failed to load track ${track.title} from URL:`, error)
      
      // Fallback: Try HTML5 Audio for streaming
      await this.loadTrackWithHTMLAudio(track)
    }
  }

  // Fallback method using HTML5 Audio for streaming
  private async loadTrackWithHTMLAudio(track: Track): Promise<void> {
    try {
      console.log(`Trying HTML5 Audio fallback for: ${track.title}`)
      
      const audio = new Audio()
      audio.crossOrigin = 'anonymous'
      audio.src = track.audioUrl
      
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve)
        audio.addEventListener('error', reject)
        audio.load()
      })
      
      // Create a simple buffer for HTML5 audio (we'll handle this differently)
      console.log(`✅ HTML5 Audio ready: ${track.title}`)
      
    } catch (error) {
      console.error(`HTML5 Audio also failed for ${track.title}:`, error)
    }
  }

  async playTrack(track: Track): Promise<void> {
    // Ensure audio context is initialized
    if (!this.audioContext) {
      console.warn('AudioContext not initialized - user interaction required')
      return
    }

    // Don't restart the same track
    if (this.currentTrackId === track.id && this.currentSource) {
      console.log(`Already playing: ${track.title}`)
      return
    }

    // Load track if not already loaded
    if (!this.audioBuffers.has(track.id)) {
      console.log(`Loading track: ${track.title}`)
      await this.loadTrack(track)
    }

    const audioBuffer = this.audioBuffers.get(track.id)
    if (!audioBuffer) {
      console.error(`No audio buffer found for: ${track.title}`)
      return
    }

    console.log(`🎵 Starting playback: ${track.title} (${audioBuffer.duration}s)`)

    // Crossfade to new track
    await this.crossfadeToTrack(audioBuffer, track.id)

    console.log(`✅ Now playing: ${track.title}`)
  }

  private async crossfadeToTrack(audioBuffer: AudioBuffer, trackId: string): Promise<void> {
    if (!this.audioContext) return

    const crossfadeDuration = 0.5 // 500ms crossfade
    const currentTime = this.audioContext.currentTime

    console.log(`🔄 Crossfading to track ${trackId} at time ${currentTime}`)

    // Stop and clean up any existing next source (shouldn't happen, but be safe)
    if (this.nextSource) {
      try {
        this.nextSource.stop()
        this.nextSource.disconnect()
      } catch (error) {
        console.warn('Error stopping existing next source:', error)
      }
      this.nextSource = null
      this.nextGain = null
    }

    // Create completely fresh source and gain nodes for the new track
    this.nextSource = this.audioContext.createBufferSource()
    this.nextGain = this.audioContext.createGain()

    // Configure the new source
    this.nextSource.buffer = audioBuffer
    this.nextSource.loop = true
    
    // Connect: source -> gain -> destination
    this.nextSource.connect(this.nextGain)
    this.nextGain.connect(this.audioContext.destination)

    // Start new track at 0 volume
    this.nextGain.gain.setValueAtTime(0, currentTime)
    
    // Add error handling for the source
    this.nextSource.onended = () => {
      console.log(`🔚 Track ${trackId} ended unexpectedly`)
    }

    // Start the new source
    try {
      this.nextSource.start(0) // Start immediately
      console.log(`▶️ Started new source for track ${trackId}`)
    } catch (error) {
      console.error(`Failed to start source for track ${trackId}:`, error)
      return
    }

    // Fade in new track
    this.nextGain.gain.linearRampToValueAtTime(0.7, currentTime + crossfadeDuration)

    // Fade out and stop current track if it exists
    if (this.currentSource && this.currentGain) {
      const oldSource = this.currentSource
      const oldGain = this.currentGain
      
      // Fade out
      oldGain.gain.linearRampToValueAtTime(0, currentTime + crossfadeDuration)
      
      // Stop and disconnect old source after fade out
      setTimeout(() => {
        try {
          oldSource.stop()
          oldSource.disconnect()
          console.log(`🛑 Stopped and disconnected old source`)
        } catch (error) {
          console.warn('Error stopping old source (may already be stopped):', error)
        }
      }, (crossfadeDuration * 1000) + 100) // Add small buffer
    }

    // Swap references - the new track becomes current
    this.currentSource = this.nextSource
    this.currentGain = this.nextGain
    this.currentTrackId = trackId
    
    // Clear next references
    this.nextSource = null
    this.nextGain = null

    console.log(`✅ Crossfade complete for track ${trackId}`)
  }

  stopCurrentTrack(): void {
    console.log('🛑 Stopping all tracks')
    
    // Stop and disconnect current source
    if (this.currentSource) {
      try {
        this.currentSource.stop()
        this.currentSource.disconnect()
        console.log('Stopped current source')
      } catch (error) {
        console.warn('Error stopping current source:', error)
      }
      this.currentSource = null
    }
    
    // Stop and disconnect next source
    if (this.nextSource) {
      try {
        this.nextSource.stop()
        this.nextSource.disconnect()
        console.log('Stopped next source')
      } catch (error) {
        console.warn('Error stopping next source:', error)
      }
      this.nextSource = null
    }
    
    // Clear gain references
    this.currentGain = null
    this.nextGain = null
    this.currentTrackId = null
    
    console.log('✅ All tracks stopped and cleaned up')
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
