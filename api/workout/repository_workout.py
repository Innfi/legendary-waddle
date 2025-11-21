from uuid import UUID

import structlog
from sqlalchemy import Column
from sqlalchemy.orm import Session

from workout.model import Record, Workout

log = structlog.get_logger()


def create_workout(db: Session, new_workout: Workout):
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


def update_workout(db: Session, workout_id: int, updated_workout: Workout):
    """Updates an existing workout."""
    log.info("Updating workout", workout_id=workout_id)
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if workout:
        for key, value in updated_workout.model_dump().items():
            setattr(workout, key, value)
        db.commit()
        db.refresh(workout)

    return workout


def find_workout(db: Session, workout_id: int):
    """Fetches a workout by its ID."""
    log.info("Fetching workout", workout_id=workout_id)
    return db.query(Workout).filter(Workout.id == workout_id).first()


def update_workout_memo(
    db: Session, workout_id: int, owner_id: Column[UUID], memo: str | None
):
    """Updates the memo field of a workout for a specific user."""
    log.info("Updating workout memo", workout_id=workout_id, user_id=owner_id)
    workout = (
        db.query(Workout)
        .filter(Workout.id == workout_id, Workout.owner_id == owner_id)
        .first()
    )

    if workout:
        workout.memo = memo
        db.commit()
        db.refresh(workout)
        return workout

    return None


def find_workouts(db: Session, owner_id: Column[UUID], date_key: str | None = None):
    """Fetches workouts for a user, with an optional filter for date key."""
    log.info("Fetching workouts for user", user_id=owner_id)
    query = db.query(Workout).filter(Workout.owner_id == owner_id)
    if date_key:
        query = query.filter(Workout.date_key == date_key)

    return query.order_by(Workout.id).all()


def find_workouts_by_datekeys(
    db: Session, owner_id: Column[UUID], from_date: str, to_date: str
):
    """Fetches workouts for a user within a specified date range."""
    log.info(
        "Fetching workouts for user in date range",
        user_id=owner_id,
        from_date=from_date,
        to_date=to_date,
    )
    return (
        db.query(Workout)
        .filter(
            Workout.owner_id == owner_id,
            Workout.date_key >= from_date,
            Workout.date_key <= to_date,
        )
        .order_by(Workout.date_key)
        .all()
    )


def find_workouts_by_name_and_date(
    db: Session, owner_id: Column[UUID], date_key: str, workout_name: str
):
    """Finds a workout by owner, date_key, and workout name."""
    log.info(
        "Finding workout by name and date",
        user_id=owner_id,
        date_key=date_key,
        workout_name=workout_name,
    )
    return (
        db.query(Workout)
        .filter(
            Workout.owner_id == owner_id,
            Workout.date_key == date_key,
            Workout.name == workout_name,
        )
        .first()
    )


def create_workout_if_not_exists(
    db: Session, owner_id: Column[UUID], date_key: str, workout_name: str
):
    """Creates a new workout if it doesn't exist, returns existing if found."""
    existing_workout = find_workouts_by_name_and_date(
        db, owner_id, date_key, workout_name
    )
    if existing_workout:
        log.info("Found existing workout", workout_id=existing_workout.id)
        return existing_workout

    log.info(
        "Creating new workout",
        user_id=owner_id,
        date_key=date_key,
        workout_name=workout_name,
    )
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


def create_record(db: Session, new_record: Record):
    """Creates a new record and commits it to the database."""
    log.info(
        "repository_record.create_one",
        workout_id=new_record.workout_id,
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


def find_records_by_workout_ids(db: Session, workout_ids: list[Column[int]]):
    """Fetches records for a user that match any of the provided workout IDs."""
    log.info("Fetching records for user by workout IDs", workout_ids=workout_ids)
    query = db.query(Record).filter(Record.workout_id.in_(workout_ids))

    return query.order_by(Record.workout_date.desc()).all()


def find_records_by_workout_id(db: Session, workout_id: Column[int]):
    """Fetches records for a user that match the provided workout ID."""
    log.info("Fetching records for user by workout ID", workout_id=workout_id)
    query = db.query(Record).filter(Record.workout_id == workout_id)

    return query.order_by(Record.workout_date.desc()).all()


def bulk_create_workouts_with_records(
    db: Session, owner_id: Column[UUID], date_key: str, workouts_data: list
):
    """Bulk creates workouts and their records in a single transaction."""
    from datetime import datetime

    log.info(
        "Bulk creating workouts with records",
        user_id=owner_id,
        date_key=date_key,
        workout_count=len(workouts_data),
    )

    # Parse date_key to datetime (format: yymmdd)
    workout_date = datetime.strptime(date_key, "%y%m%d")

    created_workouts = []

    for workout_data in workouts_data:
        # Create workout
        workout = Workout(
            owner_id=owner_id,
            date_key=date_key,
            name=workout_data["name"],
            memo=workout_data.get("memo", ""),
        )
        db.add(workout)
        db.flush()  # Flush to get the workout ID without committing

        # Create records for this workout
        for record_data in workout_data["records"]:
            record = Record(
                workout_id=workout.id,
                workout_set=record_data["sets"],
                workout_reps=record_data["reps"],
                weight=record_data.get("weight", 0),
                workout_date=workout_date,
            )
            db.add(record)

        created_workouts.append(workout)

    # Commit all changes at once
    db.commit()

    # Refresh all workouts
    for workout in created_workouts:
        db.refresh(workout)

    log.info(
        "Successfully created workouts with records",
        workout_count=len(created_workouts),
    )

    return created_workouts
