import mockTracks from '../data/mock_tracks.json'

export interface Track {
  id: string
  title: string
  artist: string
  audioUrl: string
  energy: number // 0-1
  texture: number // 0-1
  tags: string[]
  show: {
    date: string
    venue: string
  }
}

export interface VibeCoordinates {
  x: number // texture: 0 = organic, 1 = synthetic
  y: number // energy: 0 = high, 1 = low (inverted for UI)
}

class VibeEngine {
  private tracks: Track[] = mockTracks

  // Find the closest track to given coordinates
  findNearestTrack(coordinates: VibeCoordinates): Track | null {
    if (this.tracks.length === 0) return null

    // Convert UI coordinates to energy/texture space
    const targetEnergy = 1 - coordinates.y // Invert Y for energy
    const targetTexture = coordinates.x

    let closestTrack = this.tracks[0]
    let minDistance = this.calculateDistance(
      targetEnergy, 
      targetTexture, 
      closestTrack.energy, 
      closestTrack.texture
    )

    // Find track with minimum Euclidean distance
    for (const track of this.tracks) {
      const distance = this.calculateDistance(
        targetEnergy,
        targetTexture,
        track.energy,
        track.texture
      )

      if (distance < minDistance) {
        minDistance = distance
        closestTrack = track
      }
    }

    // Add some fuzz zone - if too far from any track, return null for static
    const FUZZ_THRESHOLD = 0.3
    if (minDistance > FUZZ_THRESHOLD) {
      return null // This will trigger static/fuzz audio
    }

    return closestTrack
  }

  // Calculate Euclidean distance between two points
  private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  // Get all tracks for debugging
  getAllTracks(): Track[] {
    return this.tracks
  }

  // Get track by ID
  getTrackById(id: string): Track | undefined {
    return this.tracks.find(track => track.id === id)
  }
}

export default new VibeEngine()
