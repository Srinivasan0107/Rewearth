from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users, items, swaps

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ReWearth API",
    description="Sustainable clothing swap platform API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(items.router)
app.include_router(swaps.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "ReWearth API"}
