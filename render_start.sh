#!/usr/bin/env bash
set -e

echo "=== Starting Next.js frontend on port 3000 ==="
cd frontend

# Next.js standalone mode runs from .next/standalone
if [ -d ".next/standalone" ]; then
  cd .next/standalone
  # Copy static and public assets
  cp -r ../../public ./public 2>/dev/null || true
  cp -r ../../.next/static ./.next/static 2>/dev/null || true
  PORT=3000 HOSTNAME=0.0.0.0 node server.js &
  NEXT_PID=$!
  cd ../../..
else
  PORT=3000 npm start &
  NEXT_PID=$!
  cd ..
fi

# Wait for Next.js to be ready
echo "Waiting for Next.js to start..."
for i in $(seq 1 60); do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "Next.js is ready!"
    break
  fi
  sleep 1
done

echo "=== Starting FastAPI backend on port $PORT ==="
cd backend
uvicorn main:app --host 0.0.0.0 --port $PORT

# If uvicorn exits, kill Next.js too
kill $NEXT_PID 2>/dev/null
