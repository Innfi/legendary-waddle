from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
import structlog
from datetime import datetime, timedelta, timezone

from api.auth.current_user import get_current_user
from api.common.database import get_db
from api.auth.models import User
from api.workouts.dto import WorkoutRecordItem, CreateRecordPayload
from api.workouts.repository_workouts import find_many_by_date_keys
from api.workouts.repository_workouts import find_many, create_one

router = APIRouter()
log = structlog.get_logger()

@router.get('/workouts', response_model=list[WorkoutRecordItem])
def get_workouts(db: Session = Depends(get_db), 
                 current_user: User = Depends(get_current_user), 
                 from_date: str | None = Query(None),
                 to_date: str | None = Query(None)):
    if from_date is None or to_date is None:
        today = datetime.now(timezone.utc)
        one_month_ago = today - timedelta(days=30)
        from_date = one_month_ago.strftime("%yy%m%d")
        to_date = today.strftime("%yy%m%d")

    workouts = find_many_by_date_keys(db, current_user.id, from_date, to_date)
    if workouts is None:
        return []
    
@router.post("/records", status_code=status.HTTP_201_CREATED)
def create_record(record: CreateRecordPayload, 
                  db: Session = Depends(get_db), 
                  current_user: User = Depends(get_current_user)):
    create_one(db, record, current_user.id)

    return
@router.get("/records", response_model=list[WorkoutRecordItem])
def get_records(db: Session = Depends(get_db), 
                current_user: User = Depends(get_current_user), 
                date_key: str | None = Query(None),
                workout_name: str | None = Query(None)):
    return find_many(db, current_user.id, date_key, workout_name)

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
        
    return find_many_by_date_keys(db, current_user.id, from_date, to_date)