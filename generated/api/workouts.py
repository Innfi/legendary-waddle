from fastapi import APIRouter
import json

router = APIRouter()

@router.get("/workouts")
def get_workouts():
    with open("db.json", "r") as f:
        data = json.load(f)
    return data["workouts"]
