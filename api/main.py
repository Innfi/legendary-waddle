from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from auth import router as auth2_router
from repository.database import engine
import repository.models as models
from common.logger import setup_logging
from records import router as records_router
from dashboard import router as dashboard_router

setup_logging()
log = structlog.get_logger()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(records_router)
app.include_router(auth2_router)
app.include_router(dashboard_router)

@app.get("/")
def read_root():
    log.info("Root endpoint called")
    return {"Hello": "World"}
