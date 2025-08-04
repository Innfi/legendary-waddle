from sqlalchemy.orm import Session
import structlog

from repository.models import User

log = structlog.get_logger()

def get_user_by_oauth_provider_id(db: Session, oauth_provider_id: str):
    return db.query(User).filter(User.oauth_provider_id == oauth_provider_id).first()

def create_user(db: Session, oauth_provider_id: str, email: str, name: str):
    log.info("Creating new user", email=email, oauth_provider_id=oauth_provider_id)
    user = User(oauth_provider_id=oauth_provider_id, email=email, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
