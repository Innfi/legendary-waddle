from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import User, Workout, Exercise
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List
import structlog

from auth import get_current_user
from common.database import get_db

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
    log.info("Fetching dashboard data", user_id=current_user.id)
    one_week_ago = datetime.utcnow().date() - timedelta(days=7)

    results = (
        db.query(
            Workout.name,
            func.sum(Exercise.sets).label("total_sets"),
            func.sum(Exercise.reps).label("total_reps"),
        )
        .join(Exercise, Workout.id == Exercise.workout_id)
        .filter(Workout.owner_id == current_user.id)
        .filter(Workout.date >= one_week_ago)
        .group_by(Workout.name)
        .all()
    )

    workout_stats = [
        WorkoutStat(workout_name=name, total_sets=sets or 0, total_reps=reps or 0)
        for name, sets, reps in results
    ]

    return DashboardData(workouts=workout_stats)