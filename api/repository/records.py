from sqlalchemy import Column
from sqlalchemy.orm import Session
import structlog

from repository.models import Record
from repository.schema import CreateRecordPayload

log = structlog.get_logger()

def get_records_by_owner_id(
    db: Session, owner_id: Column[str], date_key: str | None, workout_name: str | None
):
    log.info("Fetching records for user", user_id=owner_id)
    query = db.query(Record).filter(Record.owner_id == owner_id)
    if date_key:
        query = query.filter(Record.date_key == date_key)
    if workout_name:
        query = query.filter(Record.workout_name == workout_name)
    return query.all()

def create_record(db: Session, record: CreateRecordPayload, owner_id: Column[str]):
    log.info(
        "Creating record for user",
        user_id=owner_id,
        workout_name=record.workout_name,
    )
    db_record = Record(**record.model_dump(), owner_id=owner_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record
