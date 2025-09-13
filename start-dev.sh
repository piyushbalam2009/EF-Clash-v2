#!/bin/bash

echo "Starting EF Clash Development Environment..."
echo

echo "[1/3] Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install frontend dependencies"
    exit 1
fi

echo
echo "[2/3] Installing backend dependencies..."
cd backend
python3 -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install backend dependencies"
    exit 1
fi

echo
echo "[3/3] Starting development servers..."
echo

echo "Starting FastAPI backend on http://localhost:8000"
python3 main.py &
BACKEND_PID=$!

cd ..
echo "Starting React frontend on http://localhost:3000"
sleep 3
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "EF Clash Development Environment Started"
echo "========================================"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "Backend API Docs: http://localhost:8000/docs"
echo
echo "Press Ctrl+C to stop all servers"

# Function to cleanup background processes
cleanup() {
    echo
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait
