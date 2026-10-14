from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.database.connection import check_db_connection
from app.routers import (
    auth_router,
    users_router,
    restaurants_router,
    categories_router,
    foods_router,
    coupons_router,
    orders_router,
    payments_router,
    favorites_router,
    admin_router,
)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="High-performance production REST API backend for FoodieGo online food ordering platform.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware Configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if settings.APP_ENV != "development" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API V1 routers
api_prefix = settings.API_V1_PREFIX  # /api/v1

app.include_router(auth_router, prefix=api_prefix)
app.include_router(users_router, prefix=api_prefix)
app.include_router(restaurants_router, prefix=api_prefix)
app.include_router(categories_router, prefix=api_prefix)
app.include_router(foods_router, prefix=api_prefix)
app.include_router(coupons_router, prefix=api_prefix)
app.include_router(orders_router, prefix=api_prefix)
app.include_router(payments_router, prefix=api_prefix)
app.include_router(favorites_router, prefix=api_prefix)
app.include_router(admin_router, prefix=api_prefix)


@app.get("/health", tags=["Health"])
def health_check():
    """Liveness probe verifying application status and MySQL connectivity."""
    db_connected = check_db_connection()
    return {
        "status": "ok" if db_connected else "degraded",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "database": "connected" if db_connected else "disconnected",
    }


@app.get("/", tags=["Root"])
def root():
    """Welcome endpoint providing service metadata and interactive Swagger links."""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "api_v1": settings.API_V1_PREFIX,
    }
