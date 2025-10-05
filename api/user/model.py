from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from common.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    oauth_provider_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    avatar_url = Column(String)
    favorite_workouts = Column(JSON)
    goal = Column(String)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
