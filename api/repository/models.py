from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from api.common.database import Base

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    planned_date = Column(Date)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)

    details = relationship("ScheduleDetail", back_populates="schedule")

class ScheduleDetail(Base):
    __tablename__ = "schedule_details"

    id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(Integer, ForeignKey("schedules.id"))
    workout_name = Column(String)
    sets = Column(Integer)
    reps = Column(Integer)

    schedule = relationship("Schedule", back_populates="details")
