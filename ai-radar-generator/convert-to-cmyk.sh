#!/bin/bash
# Convert the RGB print PDF to a CMYK PDF using an ICC profile.
# Defaults to PSOcoated_v3 (FOGRA51), the current European coated-stock standard.
#
# Usage:
#   ./convert-to-cmyk.sh                                   # uses defaults
#   ./convert-to-cmyk.sh input.pdf                         # custom input
#   ./convert-to-cmyk.sh input.pdf profiles/Other.icc      # custom profile
#
# Requires:
#   - ghostscript (brew install ghostscript)
#   - ICC profile at profiles/PSOcoated_v3.icc
#     Download "eci_offset_2009.zip" from https://www.eci.org/en/downloads
#     and copy PSOcoated_v3.icc into profiles/.

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INPUT="${1:-$SCRIPT_DIR/output/ai-radar-print.pdf}"
PROFILE="${2:-$SCRIPT_DIR/profiles/PSOcoated_v3.icc}"
OUTPUT="${INPUT%.pdf}-cmyk.pdf"

if ! command -v gs >/dev/null 2>&1; then
  echo "❌ ghostscript not found." >&2
  echo "   Install with: brew install ghostscript" >&2
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "❌ Input PDF not found: $INPUT" >&2
  echo "   Generate it first with: ./generate.sh --print" >&2
  exit 1
fi

if [ ! -f "$PROFILE" ]; then
  echo "❌ ICC profile not found: $PROFILE" >&2
  echo "   Download the ECI offset profiles from https://www.eci.org/en/downloads" >&2
  echo "   and place PSOcoated_v3.icc at: $PROFILE" >&2
  exit 1
fi

echo "🎨 Converting to CMYK..."
echo "   Input:   $INPUT"
echo "   Profile: $PROFILE (FOGRA51 / PSOcoated_v3)"
echo "   Output:  $OUTPUT"

gs -dSAFER -dBATCH -dNOPAUSE -dNOOUTERSAVE \
  -sDEVICE=pdfwrite \
  -dCompatibilityLevel=1.7 \
  -dEmbedAllFonts=true \
  -dSubsetFonts=true \
  -dAutoFilterColorImages=false \
  -dAutoFilterGrayImages=false \
  -dColorImageFilter=/FlateEncode \
  -dGrayImageFilter=/FlateEncode \
  -dDownsampleColorImages=false \
  -dDownsampleGrayImages=false \
  -dDownsampleMonoImages=false \
  -sProcessColorModel=DeviceCMYK \
  -sColorConversionStrategy=CMYK \
  -dOverrideICC=true \
  -sOutputICCProfile="$PROFILE" \
  -sDefaultCMYKProfile="$PROFILE" \
  -dRenderIntent=1 \
  -sOutputFile="$OUTPUT" \
  "$INPUT"

SIZE=$(du -h "$OUTPUT" | awk '{print $1}')
echo "✅ CMYK PDF: $OUTPUT ($SIZE)"
echo ""
echo "Verify with:"
echo "  pdffonts \"$OUTPUT\"                          # check fonts embedded"
echo "  gs -o - -sDEVICE=inkcov \"$OUTPUT\" | tail    # check ink coverage (CMYK only)"
