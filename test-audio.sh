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
echo "🎯 Required files (any supported format):"
echo "   - electric_storm.{wav,mp3,m4a,ogg,flac} (🔋 High Energy + Synthetic)"
echo "   - garage_anthem.{wav,mp3,m4a,ogg,flac} (🎸 High Energy + Organic)"  
echo "   - midnight_drift.{wav,mp3,m4a,ogg,flac} (🌌 Low Energy + Synthetic)"
echo "   - river_folk.{wav,mp3,m4a,ogg,flac} (🧃 Low Energy + Organic)"

echo ""
echo "⚡ Quick commands:"
echo "   npm run dev          # Start development server"
echo "   open http://localhost:3000  # Open in browser"

# Check if required files exist (any format)
echo ""
echo "✅ File status:"
for base in "electric_storm" "garage_anthem" "midnight_drift" "river_folk"; do
    found=false
    for ext in "wav" "mp3" "m4a" "ogg" "flac"; do
        file="$base.$ext"
        if [ -f "$AUDIO_DIR/$file" ]; then
            size=$(ls -lh "$AUDIO_DIR/$file" | awk '{print $5}')
            echo "   ✓ $file ($size)"
            found=true
            break
        fi
    done
    if [ "$found" = false ]; then
        echo "   ❌ $base.* (missing - will use generated tone)"
    fi
done

echo ""
echo "🌐 Suggested sources:"
echo "   - Freesound.org (search: electronic, rock, ambient, folk)"
echo "   - YouTube Audio Library"
echo "   - Suno.ai (AI generated)"
echo ""
echo "💡 Tip: Any audio format works! (.wav, .mp3, .m4a, .ogg, .flac)"
echo "   Just use the base filename: electric_storm, garage_anthem, etc."
