#!/usr/bin/env sh
set -eu

VERSION="${APP_VERSION:-0.1.0}"
COMMIT="${GIT_COMMIT:-$(git rev-parse --short HEAD 2>/dev/null || echo unknown)}"
BUILD_TIME="${BUILD_TIME:-$(date -u +"%Y-%m-%dT%H:%M:%SZ")}"

cat > .env.production.local <<EOF
VITE_APP_VERSION=$VERSION
VITE_GIT_COMMIT=$COMMIT
VITE_BUILD_TIME=$BUILD_TIME
EOF

echo "Generated frontend build info:"
cat .env.production.local