from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from common.logger import setup_logging
from user import model as user_models
from workout import model as workout_models
from auth.router import router as auth_router
from common.database import engine
from user.router import router as profile_router
from workout.router_record import router_record
from workout.router_workout import router_workout

import logging
import sys

# Setup logging for SQLAlchemy
logger = logging.getLogger('sqlalchemy.engine')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
logger.addHandler(handler)

setup_logging()
log = structlog.get_logger()

user_models.Base.metadata.create_all(bind=engine)
workout_models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router)
app.include_router(router_workout)
app.include_router(router_record)
app.include_router(profile_router)

@app.get("/")
def read_root():
    log.info("Root endpoint called")
    return {"Hello": "World"}
