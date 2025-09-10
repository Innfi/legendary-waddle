# This file is intended to be a PostgreSQL-compatible version of api/repository/models.py.
# It includes changes to data types for compatibility with PostgreSQL.

from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from repository.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    oauth_provider_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)

class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    workout_name = Column(String)
    workout_set = Column(Integer)
    workout_reps = Column(Integer)
    workout_date = Column(DateTime(timezone=True), server_default=func.now())
    date_key = Column(String, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    avatar_url = Column(String)
    favorite_workouts = Column(JSON)
    goal = Column(String)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)

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
