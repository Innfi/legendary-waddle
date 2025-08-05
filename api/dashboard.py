from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
import structlog

from auth import get_current_user
from repository2.database import get_db
from repository2.models import User
from repository2.dashboard import get_dashboard_stats_by_owner_id

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
    results = get_dashboard_stats_by_owner_id(db, current_user.id)

    workout_stats = [
        WorkoutStat(workout_name=name, total_sets=sets or 0, total_reps=reps or 0)
        for name, sets, reps in results
    ]

    return DashboardData(workouts=workout_stats)
