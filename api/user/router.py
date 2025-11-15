import structlog
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.current_user import get_current_user
from common.database import get_db
from user.dto import UserProfile
from user.model import User
from user.repository_user_profile import get_profile as get_profile_repo

router = APIRouter()
log = structlog.get_logger()


@router.get("/profile", response_model=UserProfile)
def get_profile(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return get_profile_repo(db, current_user)
