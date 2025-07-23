from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from auth import get_current_user
from common.database import get_db
from models import Workout, User, Exercise

router = APIRouter()

class ExerciseCreate(BaseModel):
    name: str
    sets: int
    reps: int

class WorkoutCreate(BaseModel):
    date: str
    name: str
    exercises: List[ExerciseCreate]

@router.get("/workouts")
def get_workouts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    default_workouts = ["Pullups", "Dips", "Squats", "Kettlebell Swings"]

    return default_workouts
    # return db.query(Workout).filter(Workout.owner_id == current_user.id).all()
    # return db.query(Workout).filter().all()

@router.post("/workouts")
def create_workout(workout: WorkoutCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_workout = Workout(date=workout.date, name=workout.name, owner_id=current_user.id)
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)

    for exercise in workout.exercises:
        db_exercise = Exercise(**exercise.model_dump(), workout_id=db_workout.id)
        db.add(db_exercise)
        db.commit()
        db.refresh(db_exercise)

    return db_workout