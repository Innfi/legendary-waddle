from sqlalchemy.orm import Session
from sqlalchemy import Column
import structlog
from uuid import UUID

from workout.model import Workout

log = structlog.get_logger()


def create_one(db: Session, new_workout: Workout):
    """Creates a new workout and commits it to the database."""
    log.info(
        "Creating workout for user",
        user_id=new_workout.owner_id,
        workout_name=new_workout.name,
        date_key=new_workout.date_key,
    )
    db_workout = Workout(**new_workout.model_dump())
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)

    return db_workout

def update_one(db: Session, workout_id: int, updated_workout: Workout):
    """Updates an existing workout."""
    log.info("Updating workout", workout_id=workout_id)
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if workout:
        for key, value in updated_workout.model_dump().items():
            setattr(workout, key, value)
        db.commit()
        db.refresh(workout)

    return workout

def find_one(db: Session, workout_id: int):
    """Fetches a workout by its ID."""
    log.info("Fetching workout", workout_id=workout_id)
    return db.query(Workout).filter(Workout.id == workout_id).first()

def update_memo(db: Session, workout_id: int, owner_id: Column[UUID], memo: str | None):
    """Updates the memo field of a workout for a specific user."""
    log.info("Updating workout memo", workout_id=workout_id, user_id=owner_id)
    workout = db.query(Workout).filter(
        Workout.id == workout_id, 
        Workout.owner_id == owner_id
    ).first()
    
    if workout:
        setattr(workout, 'memo', memo)
        db.commit()
        db.refresh(workout)
        return workout
    
    return None

def find_many(db: Session, owner_id: Column[UUID], date_key: str | None = None):
    """Fetches workouts for a user, with an optional filter for date key."""
    log.info("Fetching workouts for user", user_id=owner_id)
    query = db.query(Workout).filter(Workout.owner_id == owner_id)
    if date_key:
        query = query.filter(Workout.date_key == date_key)

    return query.order_by(Workout.id).all()

def find_many_by_date_keys(db: Session, owner_id: Column[UUID], from_date: str, to_date: str):
    """Fetches workouts for a user within a specified date range."""
    log.info("Fetching workouts for user in date range", user_id=owner_id, from_date=from_date, to_date=to_date)
    return db.query(Workout).filter(
        Workout.owner_id == owner_id,
        Workout.date_key >= from_date,
        Workout.date_key <= to_date
    ).order_by(Workout.date_key).all()

def find_by_name_and_date(db: Session, owner_id: Column[UUID], date_key: str, workout_name: str):
    """Finds a specific workout by user, date, and name."""
    log.info("Finding workout by name and date", user_id=owner_id, date_key=date_key, workout_name=workout_name)
    return db.query(Workout).filter(
        Workout.owner_id == owner_id,
        Workout.date_key == date_key,
        Workout.name == workout_name
    ).first()

def create_workout_if_not_exists(db: Session, owner_id: Column[UUID], date_key: str, workout_name: str):
    """Creates a new workout if it doesn't exist, returns existing if found."""
    existing_workout = find_by_name_and_date(db, owner_id, date_key, workout_name)
    if existing_workout:
        log.info("Found existing workout", workout_id=existing_workout.id)
        return existing_workout
    
    log.info("Creating new workout", user_id=owner_id, date_key=date_key, workout_name=workout_name)
    new_workout = Workout(
        owner_id=owner_id,
        date_key=date_key,
        name=workout_name,
        memo="",
    )

    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)
    return new_workout
