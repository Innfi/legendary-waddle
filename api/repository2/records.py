# This file is intended to be a PostgreSQL-compatible version of api/repository/records.py.
# The logic is largely the same, but this version is prepared for a PostgreSQL database.

from sqlalchemy.orm import Session
from sqlalchemy import Column
import structlog
from uuid import UUID

from repository2.models import Record
from repository2.schema import CreateRecordPayload

log = structlog.get_logger()

def get_records_by_owner_id(
    db: Session, owner_id: Column[UUID], date_key: str | None, workout_name: str | None
):
    """Fetches records for a user, with optional filters for date and workout name."""
    log.info("Fetching records for user", user_id=owner_id)
    query = db.query(Record).filter(Record.owner_id == owner_id)
    if date_key:
        query = query.filter(Record.date_key == date_key)
    if workout_name:
        query = query.filter(Record.workout_name == workout_name)
    return query.all()

def create_record(db: Session, record: CreateRecordPayload, owner_id: Column[UUID]):
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
