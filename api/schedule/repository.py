from sqlalchemy.orm import Session
from sqlalchemy import Column
import structlog
from uuid import UUID
from datetime import date

from schedule.model import Schedule, ScheduleDetail
from schedule.dto import ScheduleCreate

log = structlog.get_logger()

def create_schedule(db: Session, schedule: ScheduleCreate, owner_id: Column[UUID]):
    """Creates a new schedule and its details."""
    log.info("Creating schedule for user", user_id=owner_id, planned_date=schedule.planned_date)
    
    db_schedule = Schedule(
        planned_date=schedule.planned_date,
        owner_id=owner_id
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)

    for detail in schedule.details:
        db_schedule_detail = ScheduleDetail(
            **detail.model_dump(),
            schedule_id=db_schedule.id
        )
        db.add(db_schedule_detail)
    
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule

def get_schedules_by_owner_id(db: Session, owner_id: Column[UUID], from_date: date | None, to_date: date | None):
    """Fetches schedules for a user within a given date range."""
    log.info("Fetching schedules for user in date range", user_id=owner_id, from_date=from_date, to_date=to_date)
    query = db.query(Schedule).filter(Schedule.owner_id == owner_id)
    if from_date:
        query = query.filter(Schedule.planned_date >= from_date)
    if to_date:
        query = query.filter(Schedule.planned_date <= to_date)
    return query.order_by(Schedule.planned_date).all()
