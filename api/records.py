from fastapi import APIRouter, Depends, Query, status
from pydantic.alias_generators import to_camel
from sqlalchemy.orm import Session
import structlog

from auth import get_current_user
from repository.database import get_db
from repository.records import get_records_by_owner_id
from repository.records import create_record as create_record_repo
from repository.models import User
from repository.schema import WorkoutRecordItem, CreateRecordPayload

router = APIRouter()
log = structlog.get_logger()

@router.get("/records", response_model=list[WorkoutRecordItem])
def get_records(db: Session = Depends(get_db), 
                current_user: User = Depends(get_current_user), 
                date_key: str | None = Query(None),
                workout_name: str | None = Query(None)):
    return get_records_by_owner_id(db, current_user.id, date_key, workout_name)

@router.post("/records", status_code=status.HTTP_201_CREATED)
def create_record(record: CreateRecordPayload, 
                  db: Session = Depends(get_db), 
                  current_user: User = Depends(get_current_user)):
    create_record_repo(db, record, current_user.id)

    return
