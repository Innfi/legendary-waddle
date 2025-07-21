from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from common.database import SessionLocal
from models import User, Workout, Exercise
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class WorkoutStat(BaseModel):
    workout_name: str
    total_sets: int
    total_reps: int

class DashboardData(BaseModel):
    workouts: List[WorkoutStat]

@router.get("/dashboard/{user_id}", response_model=DashboardData)
def get_dashboard_data(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    one_week_ago = datetime.utcnow().date() - timedelta(days=7)

    results = (
        db.query(
            Workout.name,
            func.sum(Exercise.sets).label("total_sets"),
            func.sum(Exercise.reps).label("total_reps"),
        )
        .join(Exercise, Workout.id == Exercise.workout_id)
        .filter(Workout.owner_id == user_id)
        .filter(Workout.date >= one_week_ago)
        .group_by(Workout.name)
        .all()
    )

    workout_stats = [
        WorkoutStat(workout_name=name, total_sets=sets or 0, total_reps=reps or 0)
        for name, sets, reps in results
    ]

    return DashboardData(workouts=workout_stats)
