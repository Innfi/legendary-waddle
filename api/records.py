from fastapi import APIRouter, Depends, Query, status
from pydantic.alias_generators import to_camel
from sqlalchemy.orm import Session
import structlog

from auth2 import get_current_user
from common.database import get_db
from models import Record, User
from schema import WorkoutRecordItem, CreateRecordPayload

router = APIRouter()
log = structlog.get_logger()

@router.get("/records", response_model=list[WorkoutRecordItem])
def get_records(db: Session = Depends(get_db), 
                current_user: User = Depends(get_current_user), 
                date_key: str | None = Query(None),
                workout_name: str | None = Query(None)):
    log.info("Fetching records for user", user_id=current_user.id)

    query = db.query(Record).filter(Record.owner_id == current_user.id)
    if date_key:
        query = query.filter(Record.date_key == date_key)
    if workout_name:
        query = query.filter(Record.workout_name == workout_name)

    return query.all()

@router.post("/records", status_code=status.HTTP_201_CREATED)
def create_record(record: CreateRecordPayload, 
                  db: Session = Depends(get_db), 
                  current_user: User = Depends(get_current_user)):
    log.info("Creating record for user", user_id=current_user.id, workout_name=record.workout_name)

    db_record = Record(**record.model_dump(), owner_id=current_user.id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return