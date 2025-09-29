from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
import structlog
from datetime import datetime, timedelta, timezone

from auth import get_current_user
from repository.database import get_db
from repository.records import get_records_by_owner_id, get_records_by_date_key_range
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

@router.get("/records/list", response_model=list[WorkoutRecordItem])
def get_records_list(db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user),
                     from_date: str | None = Query(None),
                     to_date: str | None = Query(None)):
    if from_date is None or to_date is None:
        today = datetime.now(timezone.utc)
        one_month_ago = today - timedelta(days=30)
        from_date = one_month_ago.strftime("%yy%m%d")
        to_date = today.strftime("%yy%m%d")
        
    return get_records_by_date_key_range(db, current_user.id, from_date, to_date)

@router.post("/records", status_code=status.HTTP_201_CREATED)
def create_record(record: CreateRecordPayload, 
                  db: Session = Depends(get_db), 
                  current_user: User = Depends(get_current_user)):
    create_record_repo(db, record, current_user.id)

    return
