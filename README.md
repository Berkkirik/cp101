# Rock Paper Scissors Game

A modern, full-stack Rock-Paper-Scissors game with a Python backend and React frontend.

## Features

- **Clean Architecture**: Separation of concerns with Python backend logic and React frontend UI
- **Type Safety**: Full TypeScript support on frontend, Python type hints on backend
- **Modern Tech Stack**: FastAPI, React 18, Vite, TypeScript
- **REST API**: Well-documented API with automatic OpenAPI/Swagger documentation
- **Comprehensive Testing**: Unit tests for game logic and API endpoints
- **Best Practices**: Following industry standards for both Python and React development
- **Real-time Statistics**: Track wins, losses, draws, and win percentage
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
cp101/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── core/           # Core game logic
│   │   ├── models/         # Pydantic models
│   │   ├── api/            # API routes
│   │   └── main.py         # FastAPI application
│   ├── tests/              # Unit and API tests
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment configuration
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript types
│   │   ├── styles/         # CSS styles
│   │   └── App.tsx         # Main app component
│   ├── package.json        # Node dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md               # This file
```

## Technology Stack

### Backend
- **Python 3.11+**
- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation using Python type annotations
- **Pytest**: Testing framework
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API communication

## Getting Started

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Linux/Mac**:
     ```bash
     source venv/bin/activate
     ```
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```bash
   python -m app.main
   ```

   The API will be available at `http://localhost:8000`

6. View API documentation:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Running Tests

### Backend Tests

```bash
cd backend
pytest
```

Run with coverage:
```bash
pytest --cov=app --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm run lint
```

## API Endpoints

### `POST /api/v1/play`
Play a round of Rock-Paper-Scissors

**Request:**
```json
{
  "choice": "rock"
}
```

**Response:**
```json
{
  "player_choice": "rock",
  "computer_choice": "scissors",
  "outcome": "win",
  "message": "You win! Rock beats Scissors."
}
```

### `GET /api/v1/choices`
Get list of valid choices

**Response:**
```json
{
  "choices": ["rock", "paper", "scissors"]
}
```

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

## Game Rules

- 🪨 **Rock** beats ✂️ **Scissors**
- 📄 **Paper** beats 🪨 **Rock**
- ✂️ **Scissors** beats 📄 **Paper**
- Same choices result in a draw

## Development

### Backend Development

The backend follows Python best practices:

- **Type Hints**: All functions use type hints
- **Pydantic Models**: Request/response validation
- **Docstrings**: Comprehensive documentation
- **Error Handling**: Proper exception handling
- **Testing**: Unit tests with pytest

### Frontend Development

The frontend follows React best practices:

- **TypeScript**: Full type safety
- **Functional Components**: Using React hooks
- **Component Composition**: Reusable components
- **API Abstraction**: Centralized API client
- **Error Handling**: User-friendly error messages

## Environment Variables

### Backend (.env)
```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=["http://localhost:5173"]
```

## Building for Production

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Author

Built with best practices following Python and React standards.
