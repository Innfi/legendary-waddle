from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
import structlog
from datetime import date
from typing import List

from common.database import get_db
from auth.current_user import get_current_user
from user.model import User
from schedule.model import Schedule
from schedule.dto import ScheduleCreate
from schedule.repository import create_schedule as create_schedule_repo, get_schedules_by_owner_id

router = APIRouter()
log = structlog.get_logger()

@router.post("/schedules", response_model=Schedule, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new workout schedule.
    """
    return create_schedule_repo(db=db, schedule=schedule, owner_id=current_user.id)

@router.get("/schedules", response_model=List[Schedule])
def get_schedules(
    from_date: date | None = Query(None),
    to_date: date | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get workout schedules for the current user.
    """
    return get_schedules_by_owner_id(db=db, owner_id=current_user.id, from_date=from_date, to_date=to_date)
