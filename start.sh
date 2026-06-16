#!/bin/bash

# Get absolute path of this script's directory
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Add custom bin to PATH so custom node/npm/npx are used by all scripts
export PATH="$PROJECT_ROOT/bin:$PATH"

echo "🚀 Starting ProjectFlow..."

# Trap signals to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start the Backend API Server
echo "🌐 Starting Backend API..."
cd "$PROJECT_ROOT/backend"
# Run prisma generate to ensure client is up to date
npx prisma generate
node api/server.js &
BACKEND_PID=$!

# 2. Start the Frontend Development Server
echo "💻 Starting Frontend App..."
cd "$PROJECT_ROOT/my-project"
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are running!"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:3000"
echo "Press Ctrl+C to stop both servers."

# Keep script running
wait
