from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
import structlog

from auth import get_current_user
from common.database import get_db
from models import Record, User

router = APIRouter()
log = structlog.get_logger()

class RecordCreate(BaseModel):
    workout_id: str
    reps: int

@router.get("/records")
def get_records(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), workout_id: str | None = Query(None)):
    log.info("Fetching records for user", user_id=current_user.id)
    query = db.query(Record).filter(Record.owner_id == current_user.id)
    if workout_id:
        query = query.filter(Record.workout_id == workout_id)
    return query.all()

@router.post("/records")
def create_record(record: RecordCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    log.info("Creating record for user", user_id=current_user.id, workout_id=record.workout_id)
    
    last_set = db.query(func.max(Record.sets)).filter(Record.owner_id == current_user.id, Record.workout_id == record.workout_id).scalar() or 0
    
    db_record = Record(**record.model_dump(), owner_id=current_user.id, sets=last_set + 1)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record