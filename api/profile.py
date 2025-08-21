from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import structlog

from auth import get_current_user
from repository.database import get_db
from repository.models import User
from repository.schema import UserProfile
from repository.profile import get_profile as get_profile_repo

router = APIRouter()
log = structlog.get_logger()

@router.get("/profile", response_model=UserProfile)
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_profile_repo(db, current_user)
