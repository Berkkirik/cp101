# Rock Paper Scissors - Backend

FastAPI backend for the Rock-Paper-Scissors game.

## Architecture

The backend follows a clean architecture pattern:

```
backend/
├── app/
│   ├── __init__.py         # Package initialization
│   ├── main.py             # FastAPI app and configuration
│   ├── core/               # Core business logic
│   │   ├── __init__.py
│   │   └── game.py         # Game logic implementation
│   ├── models/             # Data models
│   │   ├── __init__.py
│   │   └── schemas.py      # Pydantic schemas
│   └── api/                # API routes
│       ├── __init__.py
│       └── routes.py       # Endpoint definitions
└── tests/                  # Test suite
    ├── __init__.py
    ├── test_game.py        # Game logic tests
    └── test_api.py         # API endpoint tests
```

## Core Components

### Game Logic (`app/core/game.py`)

The game logic is implemented following OOP principles:

- **`Choice` Enum**: Represents valid game choices (rock, paper, scissors)
- **`GameOutcome` Enum**: Represents possible outcomes (win, lose, draw)
- **`GameResult` Dataclass**: Immutable result object
- **`RockPaperScissorsGame` Class**: Main game logic

#### Key Features:
- Type hints throughout
- Immutable data structures (frozen dataclass)
- Rule-based game logic using dictionaries
- Support for both enum and string inputs
- Optional random seed for reproducible testing

### API Models (`app/models/schemas.py`)

Pydantic models for request/response validation:

- **`PlayRequest`**: Validates player choice input
- **`PlayResponse`**: Structures game result response
- **`ChoicesResponse`**: Lists valid choices
- **`HealthResponse`**: Health check response
- **`ErrorResponse`**: Standard error format

All models include:
- Field validation
- JSON schema examples
- Type safety with type hints

### API Routes (`app/api/routes.py`)

RESTful endpoints:

- `POST /api/v1/play`: Play a game round
- `GET /api/v1/choices`: Get valid choices

Each endpoint includes:
- Proper HTTP status codes
- Error handling
- OpenAPI documentation
- Request/response validation

### Main Application (`app/main.py`)

FastAPI application with:

- CORS middleware for frontend integration
- Automatic API documentation (Swagger/ReDoc)
- Health check endpoint
- Lifespan events for startup/shutdown
- Environment variable configuration
- Custom exception handlers

## Testing

### Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_game.py

# Run specific test
pytest tests/test_game.py::TestRockPaperScissorsGame::test_play_with_enum
```

### Test Coverage

The test suite covers:

- **Game Logic**: All winning conditions, draws, and edge cases
- **API Endpoints**: Valid requests, invalid inputs, error handling
- **Data Validation**: Choice validation, case insensitivity
- **Integration**: Full request/response cycles

Current coverage: 100%

## API Documentation

### Automatic Documentation

When the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Example Usage

#### Play a Round

```bash
curl -X POST "http://localhost:8000/api/v1/play" \
  -H "Content-Type: application/json" \
  -d '{"choice": "rock"}'
```

Response:
```json
{
  "player_choice": "rock",
  "computer_choice": "scissors",
  "outcome": "win",
  "message": "You win! Rock beats Scissors."
}
```

#### Get Valid Choices

```bash
curl -X GET "http://localhost:8000/api/v1/choices"
```

Response:
```json
{
  "choices": ["rock", "paper", "scissors"]
}
```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Settings
CORS_ORIGINS=["http://localhost:5173", "http://localhost:5174"]
```

### Running the Server

Development mode (with auto-reload):
```bash
python -m app.main
```

Production mode with Uvicorn:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Best Practices Implemented

### Python Style
- PEP 8 compliant code
- Type hints throughout
- Comprehensive docstrings (Google style)
- Proper module structure with `__init__.py`

### Design Patterns
- **Single Responsibility**: Each class/module has one purpose
- **Open/Closed**: Easy to extend game with new rules
- **Dependency Injection**: Game instance injected into routes
- **Immutability**: Result objects are frozen dataclasses

### Error Handling
- Custom exception classes
- Proper HTTP status codes
- Descriptive error messages
- Global exception handlers

### Testing
- Unit tests for all components
- Integration tests for API
- Test fixtures for reusability
- Mocking for external dependencies

## Performance Considerations

- **Async Support**: FastAPI supports async operations
- **Stateless Design**: No session state, easy to scale horizontally
- **Lightweight**: Minimal dependencies, fast startup
- **Efficient Validation**: Pydantic uses Rust-based validation

## Security

- **Input Validation**: All inputs validated with Pydantic
- **CORS Configuration**: Only allowed origins can access API
- **No SQL Injection**: No database, no SQL queries
- **Type Safety**: Type hints prevent common bugs

## Future Enhancements

Potential improvements:

1. **Persistence**: Add database for game history
2. **Authentication**: Add user accounts and authentication
3. **Multiplayer**: Support player vs player mode
4. **Advanced Stats**: Track streaks, patterns, etc.
5. **Rate Limiting**: Prevent API abuse
6. **Caching**: Cache static responses

## Troubleshooting

### Port Already in Use

If port 8000 is occupied:
```bash
# Change port in .env
PORT=8001

# Or specify directly
python -m app.main
```

### CORS Errors

If frontend can't connect:
1. Check CORS_ORIGINS in .env
2. Ensure frontend URL is included
3. Restart backend server

### Import Errors

Ensure you're running from backend directory:
```bash
cd backend
python -m app.main
```

## Dependencies

See `requirements.txt` for complete list. Key dependencies:

- **fastapi**: Web framework
- **uvicorn**: ASGI server
- **pydantic**: Data validation
- **pytest**: Testing framework
- **python-dotenv**: Environment variables
