#!/bin/bash

# Script to run backend tests

set -e

echo "🧪 Running Backend Tests..."

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Run tests with coverage
echo ""
echo "Running tests..."
pytest -v --cov=app --cov-report=term-missing

echo ""
echo "✅ All tests passed!"
