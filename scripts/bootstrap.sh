#!/usr/bin/env bash
set -euo pipefail

# Copy env file if it doesn't exist
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo "✔ Created .env.local from .env.local.example"
else
  echo "✔ .env.local already exists, skipping"
fi

# Install dependencies
echo "✔ Installing dependencies…"
npm install

# Start dev server
echo "✔ Starting dev server…"
npm run dev
