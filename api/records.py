from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json

router = APIRouter()

class Record(BaseModel):
    workout_id: str
    sets: int
    reps: int

@router.get("/records")
def get_records():
    with open("db.json", "r") as f:
        data = json.load(f)
    return data["records"]

@router.post("/records")
def create_record(record: Record):
    with open("db.json", "r+") as f:
        data = json.load(f)
        data["records"].append(record.dict())
        f.seek(0)
        json.dump(data, f, indent=4)
    return record
