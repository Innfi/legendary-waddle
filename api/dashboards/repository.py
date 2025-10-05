from sqlalchemy.orm import Session
from sqlalchemy import Column
import structlog
from uuid import UUID


log = structlog.get_logger()

def find_many(db: Session, owner_id: Column[UUID]):
    """Fetches dashboards for a user."""
    log.info("Fetching dashboards for user", user_id=owner_id)

    return None