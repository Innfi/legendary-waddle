from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID, JSONB

from common.database import Base


class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer)
    workout_set = Column(Integer)
    workout_reps = Column(Integer)
    weight = Column(Integer, nullable=False, default=0)
    workout_date = Column(DateTime(timezone=True), server_default=func.now())


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    date_key = Column(String, index=True)
    name = Column(String)
    memo = Column(String)


class WorkoutV2(Base):
    __tablename__ = "workouts_v2"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    date_key = Column(String, index=True)
    name = Column(String)
    memo = Column(String)
    records = Column(JSONB)  # Storing records as JSONB for flexibility
