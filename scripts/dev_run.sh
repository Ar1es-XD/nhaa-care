#!/usr/bin/env bash
set -e

echo "Starting NHAA-Care Backend..."
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "Starting NHAA-Care Frontend..."
cd ../frontend
npm run dev -- -p 3000 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
