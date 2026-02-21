#!/bin/bash

# Helper script to start all services for load testing

echo "🚀 Starting MotorOctane Services..."
echo ""

# Kill any existing processes on ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
echo "✅ Ports cleaned"
echo ""

# Start backend in background
echo "🔧 Starting Backend..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Logs: tail -f backend.log"
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Start frontend in background
echo "🌐 Starting Frontend..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   Logs: tail -f frontend.log"
echo ""

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
sleep 10

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ All services are running!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Backend:  http://localhost:5001"
echo "Frontend: http://localhost:3000"
echo ""
echo "To run load test:"
echo "  ./run-load-test.sh quick"
echo ""
echo "To stop services:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or save PIDs to file:"
echo "echo \"$BACKEND_PID $FRONTEND_PID\" > .service-pids"
echo ""
