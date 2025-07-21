from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from common.database import SessionLocal
from models import Record

router = APIRouter()

class RecordCreate(BaseModel):
    workout_id: str
    sets: int
    reps: int

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/records")
def get_records(db: Session = Depends(get_db)):
    return db.query(Record).all()

@router.post("/records")
def create_record(record: RecordCreate, db: Session = Depends(get_db)):
    db_record = Record(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record
