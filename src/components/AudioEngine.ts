import { Track } from './VibeEngine'

class AudioEngine {
  private audioContext: AudioContext | null = null
  private currentSource: AudioBufferSourceNode | null = null
  private currentGain: GainNode | null = null
  private audioBuffers: Map<string, AudioBuffer> = new Map()
  private isInitialized = false

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
      
      // Generate test tone if no audio file found
      const testBuffer = this.generateTestTone(track)
      this.audioBuffers.set(track.id, testBuffer)
      console.log(`Generated test tone for: ${track.title}`)
      
    } catch (error) {
      console.error(`Failed to load track ${track.title}:`, error)
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

  // Generate a test tone based on track characteristics
  private generateTestTone(track: Track): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized')
    
    const duration = 8 // 8 seconds
    const sampleRate = this.audioContext.sampleRate
    const numSamples = sampleRate * duration
    
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
    const data = buffer.getChannelData(0)
    
    // Map track characteristics to frequency and timbre
    const baseFreq = 220 + (track.energy * 440) // 220-660 Hz based on energy
    const harmonicRatio = track.texture // More harmonics for synthetic sounds
    
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      
      // Envelope (fade in/out)
      const envelope = Math.sin(t * Math.PI / duration) * 0.4
      
      // Fundamental frequency
      let sample = Math.sin(2 * Math.PI * baseFreq * t)
      
      // Add harmonics based on texture (synthetic = more harmonics)
      if (harmonicRatio > 0.3) {
        sample += Math.sin(2 * Math.PI * baseFreq * 2 * t) * harmonicRatio * 0.3
        sample += Math.sin(2 * Math.PI * baseFreq * 3 * t) * harmonicRatio * 0.2
      }
      
      // Add sub-harmonics for organic sounds
      if (harmonicRatio < 0.7) {
        sample += Math.sin(2 * Math.PI * baseFreq * 0.5 * t) * (1 - harmonicRatio) * 0.2
      }
      
      // Apply envelope and normalize
      data[i] = sample * envelope * 0.3
    }
    
    return buffer
  }

  async playTrack(track: Track): Promise<void> {
    if (!this.audioContext) {
      await this.initialize()
    }

    if (!this.audioContext) return

    // Stop current track
    this.stopCurrentTrack()

    // Load track if not already loaded
    if (!this.audioBuffers.has(track.id)) {
      await this.loadTrack(track)
    }

    const audioBuffer = this.audioBuffers.get(track.id)
    if (!audioBuffer) return

    // Create new source and gain nodes
    this.currentSource = this.audioContext.createBufferSource()
    this.currentGain = this.audioContext.createGain()

    // Connect: source -> gain -> destination
    this.currentSource.buffer = audioBuffer
    this.currentSource.connect(this.currentGain)
    this.currentGain.connect(this.audioContext.destination)

    // Set initial volume and start playing
    this.currentGain.gain.setValueAtTime(0.7, this.audioContext.currentTime)
    this.currentSource.loop = true
    this.currentSource.start()

    console.log(`Playing: ${track.title}`)
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
    this.currentGain = null
  }

  // Play static/fuzz when in dead zones
  playStatic(): void {
    if (!this.audioContext) return

    this.stopCurrentTrack()

    // Create white noise
    const bufferSize = this.audioContext.sampleRate * 0.5 // 0.5 seconds
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1 // Low volume static
    }

    this.currentSource = this.audioContext.createBufferSource()
    this.currentGain = this.audioContext.createGain()

    this.currentSource.buffer = buffer
    this.currentSource.connect(this.currentGain)
    this.currentGain.connect(this.audioContext.destination)

    this.currentGain.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    this.currentSource.loop = true
    this.currentSource.start()

    console.log('Playing static')
  }

  setVolume(volume: number): void {
    if (this.currentGain && this.audioContext) {
      this.currentGain.gain.setValueAtTime(volume, this.audioContext.currentTime)
    }
  }

  // Preload all tracks for smooth experience
  async preloadAllTracks(tracks: Track[]): Promise<void> {
    await this.initialize()
    
    const loadPromises = tracks.map(track => this.loadTrack(track))
    await Promise.all(loadPromises)
    
    console.log('All tracks preloaded')
  }
}

export default new AudioEngine()
