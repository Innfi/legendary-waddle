from sqlalchemy.orm import Session
from sqlalchemy import Column
import structlog
from uuid import UUID

from api.workouts.models import Record
from api.workouts.dto import CreateRecordPayload

log = structlog.get_logger()


def create_one(db: Session, record: CreateRecordPayload, owner_id: Column[UUID]):
    """Creates a new record and commits it to the database."""
    log.info(
        "Creating record for user",
        user_id=owner_id,
        workout_name=record.workout_name,
        date_key=record.date_key,
    )
    db_record = Record(**record.model_dump(), owner_id=owner_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def find_many(
    db: Session, owner_id: Column[UUID], date_key: str | None, workout_name: str | None
):
    """Fetches records for a user, with optional filters for date and workout name."""
    log.info("Fetching records for user", user_id=owner_id)
    query = db.query(Record).filter(Record.owner_id == owner_id)
    if date_key:
        query = query.filter(Record.date_key == date_key)
    if workout_name:
        query = query.filter(Record.workout_name == workout_name)
    return query.order_by(Record.workout_date.desc()).all()

def find_many_by_date_keys(
    db: Session, owner_id: Column[UUID], from_date: str | None, to_date: str | None
):
    """Fetches records for a user within a given date key range."""
    log.info("Fetching records for user in date key range", user_id=owner_id, from_date=from_date, to_date=to_date)
    query = db.query(Record).filter(Record.owner_id == owner_id)
    if from_date:
        query = query.filter(Record.date_key >= from_date)
    if to_date:
        query = query.filter(Record.date_key <= to_date)
    return query.order_by(Record.workout_date).all()

