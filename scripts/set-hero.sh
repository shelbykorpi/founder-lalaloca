#!/usr/bin/env bash
# Format and install the homepage hero image.
#
#   ./scripts/set-hero.sh path/to/photo.jpg
#
# Produces public/editorial/hero-founder.webp, sized and compressed to match the
# rest of the asset set. Requires ImageMagick (`brew install imagemagick`).

set -euo pipefail

SRC="${1:-}"
if [ -z "$SRC" ] || [ ! -f "$SRC" ]; then
  echo "Usage: ./scripts/set-hero.sh <image-file>" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/editorial/hero-founder.webp"

magick "$SRC" \
  -auto-orient \
  -strip \
  -resize '2400x>' \
  -quality 82 \
  "$OUT"

magick identify -format 'Installed %f — %wx%h, %b\n' "$OUT"
echo
echo "Next: set HERO.approved = true in src/lib/brand.ts to drop the placeholder note."
