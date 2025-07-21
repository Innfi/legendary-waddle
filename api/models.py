from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from common.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    workouts = relationship("Workout", back_populates="owner")

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    name = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

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
    workout_id = Column(String)
    sets = Column(Integer)
    reps = Column(Integer)
