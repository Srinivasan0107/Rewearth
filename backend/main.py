import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, items, swaps, chat

# Commented out to avoid connection issues on startup
# Tables already exist in database
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ReWearth API",
    description="Sustainable clothing swap platform API",
    version="1.0.0",
)

# CORS configuration for development and production
allowed_origins = [
    "http://localhost:3000",  # Local development
    "http://localhost:3001",  # Alternative local port
]

# Add production origins from environment variable
production_origin = os.getenv("FRONTEND_URL")
if production_origin:
    allowed_origins.append(production_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(items.router)
app.include_router(swaps.router)
app.include_router(chat.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "ReWearth API"}
