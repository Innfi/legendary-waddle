from fastapi import APIRouter, Depends, Query, status
from pydantic.alias_generators import to_camel
from sqlalchemy.orm import Session
import structlog
from datetime import datetime, timedelta
from itertools import groupby

from auth import get_current_user
from repository.database import get_db
from repository.records import get_records_by_owner_id, get_records_by_date_range
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

@router.get("/records/stats")
def get_records_stats(db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_user),
                      from_date: datetime | None = Query(None),
                      to_date: datetime | None = Query(None)):
    records = get_records_by_date_range(db, current_user.id, from_date, to_date)
    
    total_reps = 0
    total_sets = 0
    total_interval = timedelta(0)
    num_intervals = 0
    
    # Group records by workout name and date key
    keyfunc = lambda x: (x.workout_name, x.date_key)
    for _, group in groupby(sorted(records, key=keyfunc), key=keyfunc):
        sets = list(group)
        total_sets += len(sets)
        
        for i in range(len(sets)):
            total_reps += sets[i].workout_reps
            if i > 0:
                interval = sets[i].workout_date - sets[i-1].workout_date
                total_interval += interval
                num_intervals += 1

    avg_reps = total_reps / total_sets if total_sets > 0 else 0
    avg_interval = total_interval.total_seconds() / num_intervals if num_intervals > 0 else 0
    
    return {
        "total_reps": total_reps,
        "total_sets": total_sets,
        "avg_reps": avg_reps,
        "avg_interval_seconds": avg_interval
    }

@router.post("/records", status_code=status.HTTP_201_CREATED)
def create_record(record: CreateRecordPayload, 
                  db: Session = Depends(get_db), 
                  current_user: User = Depends(get_current_user)):
    create_record_repo(db, record, current_user.id)

    return
