from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
import structlog

from common.database import get_db
from auth.current_user import get_current_user
from user.model import User
from dashboards.repository import find_many

router = APIRouter()
log = structlog.get_logger()

class WorkoutStat(BaseModel):
    workout_name: str
    total_sets: int
    total_reps: int

class DashboardData(BaseModel):
    workouts: List[WorkoutStat]

@router.get("/dashboard", response_model=DashboardData)
def get_dashboard_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # placeholder
    return find_many(db, current_user.id)