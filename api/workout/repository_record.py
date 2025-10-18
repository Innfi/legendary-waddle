from sqlalchemy.orm import Session
from sqlalchemy import Column
import structlog
from uuid import UUID

from workout.model import Record

log = structlog.get_logger()

def create_one(db: Session, new_record: Record):
    """Creates a new record and commits it to the database."""
    log.info(
        "Creating record for user",
        user_id=new_record.owner_id,
        workout_name=new_record.workout_name,
        date_key=new_record.date_key,
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

def find_many_by_workout_ids(db: Session, workout_ids: list[Column[int]]):
    """Fetches records for a user that match any of the provided workout IDs."""
    log.info("Fetching records for user by workout IDs", workout_ids=workout_ids)
    query = db.query(Record).filter(Record.workout_id.in_(workout_ids))

    return query.order_by(Record.workout_date.desc()).all()
