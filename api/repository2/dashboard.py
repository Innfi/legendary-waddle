# This file is intended to be a PostgreSQL-compatible version of api/repository/dashboard.py.
# The logic is largely the same, but this version is prepared for a PostgreSQL database.

from sqlalchemy.orm import Session
from sqlalchemy import func
from models import User, Workout, Exercise
from datetime import datetime, timezone, timedelta
import structlog

log = structlog.get_logger()

def get_dashboard_stats_by_owner_id(db: Session, owner_id: str):
    """Fetches dashboard statistics for a given user."""
    log.info("Fetching dashboard data", user_id=owner_id)
    one_week_ago = datetime.now(timezone.utc) - timedelta(days=7)

    results = (
        db.query(
            Workout.name,
            func.sum(Exercise.sets).label("total_sets"),
            func.sum(Exercise.reps).label("total_reps"),
        )
        .join(Exercise, Workout.id == Exercise.workout_id)
        .filter(Workout.owner_id == owner_id)
        .filter(Workout.date >= one_week_ago)
        .group_by(Workout.name)
        .all()
    )

    return results
