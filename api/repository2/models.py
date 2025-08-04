# This file is intended to be a PostgreSQL-compatible version of api/repository/models.py.
# It includes changes to data types for compatibility with PostgreSQL.

from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from api.repository.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    oauth_provider_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)

    workouts = relationship("Workout", back_populates="owner")

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    name = Column(String)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    owner = relationship("User", back_populates="workouts")
    exercises = relationship("Exercise", back_populates="workout")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    sets = Column(Integer)
    reps = Column(Integer)
    workout_id = Column(Integer, ForeignKey("workouts.id"))

    workout = relationship("Workout", back_populates="exercises")

class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    workout_name = Column(String)
    workout_set = Column(Integer)
    workout_reps = Column(Integer)
    workout_date = Column(DateTime(timezone=True), server_default=func.now())
    date_key = Column(String, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
