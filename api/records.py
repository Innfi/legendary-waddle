from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import structlog

from auth import get_current_user
from common.database import get_db
from models import Record, User

router = APIRouter()
log = structlog.get_logger()

class RecordCreate(BaseModel):
    workout_id: str
    sets: int
    reps: int

@router.get("/records")
def get_records(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    log.info("Fetching records for user", user_id=current_user.id)
    return db.query(Record).filter(Record.owner_id == current_user.id).all()

@router.post("/records")
def create_record(record: RecordCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    log.info("Creating record for user", user_id=current_user.id, workout_id=record.workout_id)
    db_record = Record(**record.model_dump(), owner_id=current_user.id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record