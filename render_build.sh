#!/usr/bin/env bash
set -e

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Installing Node.js dependencies ==="
cd frontend
npm install
echo "=== Building Next.js frontend ==="
npm run build
cd ..

echo "=== Build complete ==="
