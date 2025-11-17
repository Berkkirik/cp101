"""
FastAPI application entry point for Rock-Paper-Scissors game.

This module initializes the FastAPI application with proper configuration,
middleware, CORS settings, and API documentation.
"""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from app.api.routes import router
from app.models.schemas import HealthResponse
from app import __version__

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.

    Args:
        app: FastAPI application instance
    """
    # Startup
    print("🚀 Starting Rock-Paper-Scissors API...")
    print(f"📋 Version: {__version__}")
    print(f"🔧 Debug mode: {os.getenv('DEBUG', 'False')}")
    yield
    # Shutdown
    print("👋 Shutting down Rock-Paper-Scissors API...")


# Create FastAPI application
app = FastAPI(
    title="Rock-Paper-Scissors API",
    description="""
    A modern, type-safe REST API for playing Rock-Paper-Scissors.

    ## Features

    * **Play Game**: Submit your choice and get instant results
    * **Get Choices**: Retrieve list of valid choices
    * **Type Safety**: Full request/response validation with Pydantic
    * **Auto Documentation**: Interactive API docs with Swagger UI

    ## Game Rules

    * Rock beats Scissors
    * Paper beats Rock
    * Scissors beats Paper
    * Same choices result in a draw
    """,
    version=__version__,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    tags=["health"],
    summary="Health check",
    description="Check if the API is running"
)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.

    Returns:
        HealthResponse indicating service status
    """
    return HealthResponse(
        status="healthy",
        version=__version__
    )


# Root endpoint
@app.get(
    "/",
    tags=["root"],
    summary="API information",
    description="Get basic API information and links to documentation"
)
async def root():
    """
    Root endpoint with API information.

    Returns:
        JSON with API information and useful links
    """
    return {
        "message": "Rock-Paper-Scissors API",
        "version": __version__,
        "docs": "/docs",
        "health": "/health",
        "api": "/api/v1"
    }


# Include API routes
app.include_router(router)


# Custom exception handler
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """
    Handle ValueError exceptions globally.

    Args:
        request: The request that caused the error
        exc: The exception instance

    Returns:
        JSON response with error details
    """
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)}
    )


if __name__ == "__main__":
    import uvicorn

    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("DEBUG", "True").lower() == "true"

    # Run the application
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
