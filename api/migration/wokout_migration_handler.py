from uuid import UUID
from sqlalchemy import Column

import structlog

from common.database import get_db
from workout_v2.dto import WorkoutItemV2, WorkoutRecordPayload

log = structlog.get_logger()

async def migrate_workouts(date_key: str, user_id: Column[UUID]):
    """Background task to migrate workouts to the new schema."""
    log.info("Starting workout migration", date_key=date_key, user_id=user_id)

    try:
        from workout.router_workout import fetch_workout_detail
        from workout_v2.repository import bulk_create_workouts_v2, count_workouts_by_datekeys

        db = next(get_db())
        log.info("Starting workout migration", date_key=date_key, user_id=user_id)
        workouts = fetch_workout_detail(date_key, db, user_id)

        if not workouts:
            log.info("No workouts found for migration", date_key=date_key, user_id=user_id)
            return

        existing_count = count_workouts_by_datekeys(db, user_id, date_key, date_key)
        if existing_count > 0:
            log.info("Workouts already migrated for this date", date_key=date_key, user_id=user_id)
            return

        workouts_data: list[WorkoutItemV2] = []
        for workout in workouts:
            records_v2 = [
                WorkoutRecordPayload(
                    workout_set=record.workout_set,
                    workout_reps=record.workout_reps,
                    weight=record.weight,
                )
                for record in workout.records
            ]

            item = WorkoutItemV2(date_key=workout.date_key, name=workout.name, memo=workout.memo or "", records=records_v2)
            workouts_data.append(item)

        log.info("new workouts_data", workouts_data=workouts_data)
        bulk_create_workouts_v2(db, user_id, workouts_data)

    except Exception as e:
        log.error("migration error", error=str(e))
        return
