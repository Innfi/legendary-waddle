from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from common.database import Base

class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer)  # Added workout_id column
    workout_set = Column(Integer)
    workout_reps = Column(Integer)
    weight = Column(Integer, nullable=False, default=0)
    workout_date = Column(DateTime(timezone=True), server_default=func.now())
    # deprecated 
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    date_key = Column(String, index=True)
    workout_name = Column(String)

class Workout(Base):
    __tablename__ = "workout_memos"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    date_key = Column(String, index=True)
    index = Column(Integer) 
    name = Column(String)
    memo = Column(String)

