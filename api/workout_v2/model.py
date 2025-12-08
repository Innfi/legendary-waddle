from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID, JSONB

from common.database import Base


class WorkoutV2(Base):
    __tablename__ = "workouts_v2"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    date_key = Column(String, index=True)
    name = Column(String)
    memo = Column(String)
    records = Column(JSONB)  # Storing records as JSONB for flexibility
