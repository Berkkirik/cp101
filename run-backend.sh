#!/bin/bash

# Script to set up and run the backend server

set -e

echo "🚀 Setting up Rock-Paper-Scissors Backend..."

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Run tests
echo "🧪 Running tests..."
pytest -v

# Start server
echo ""
echo "✅ Tests passed! Starting server..."
echo "📡 Server will be available at http://localhost:8000"
echo "📚 API docs at http://localhost:8000/docs"
echo ""
python -m app.main
