#!/bin/bash

# Quick audio testing script for vibe-city
echo "🎵 Vibe-City Audio Testing Helper"
echo "================================="

AUDIO_DIR="public/audio"

# Check if audio directory exists
if [ ! -d "$AUDIO_DIR" ]; then
    echo "❌ Audio directory not found: $AUDIO_DIR"
    exit 1
fi

# List current audio files
echo "📁 Current audio files:"
ls -la "$AUDIO_DIR"/*.{mp3,wav,m4a} 2>/dev/null || echo "   No audio files found"

echo ""
echo "🎯 Required files:"
echo "   - electric_storm.wav (🔋 High Energy + Synthetic)"
echo "   - garage_anthem.wav (🎸 High Energy + Organic)"  
echo "   - midnight_drift.wav (🌌 Low Energy + Synthetic)"
echo "   - river_folk.wav (🧃 Low Energy + Organic)"

echo ""
echo "⚡ Quick commands:"
echo "   npm run dev          # Start development server"
echo "   open http://localhost:3000  # Open in browser"

# Check if required files exist
echo ""
echo "✅ File status:"
for file in "electric_storm.wav" "garage_anthem.wav" "midnight_drift.wav" "river_folk.wav"; do
    if [ -f "$AUDIO_DIR/$file" ]; then
        size=$(ls -lh "$AUDIO_DIR/$file" | awk '{print $5}')
        echo "   ✓ $file ($size)"
    else
        echo "   ❌ $file (missing - will use generated tone)"
    fi
done

echo ""
echo "🌐 Suggested sources:"
echo "   - Freesound.org (search: electronic, rock, ambient, folk)"
echo "   - YouTube Audio Library"
echo "   - Suno.ai (AI generated)"
echo ""
echo "💡 Tip: Any audio files will work for testing!"
echo "   Just rename them to match the required filenames."
