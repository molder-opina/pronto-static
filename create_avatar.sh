#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="${SCRIPT_DIR}/src/static_content/assets"

mkdir -p "${ASSETS_DIR}/images"
cp "${ASSETS_DIR}/pronto/menu/agua_horchata.png" \
  "${ASSETS_DIR}/images/default-avatar.png"
