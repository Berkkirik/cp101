#!/bin/bash

# Script to set up and run the frontend dev server

set -e

echo "🚀 Setting up Rock-Paper-Scissors Frontend..."

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start dev server
echo ""
echo "✅ Dependencies installed! Starting dev server..."
echo "🌐 Frontend will be available at http://localhost:5173"
echo ""
npm run dev
