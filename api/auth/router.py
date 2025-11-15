import os

import jwt
import requests
import structlog
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session

from common.database import get_db
from user.repository_user import create_user, get_user_by_oauth_provider_id

router = APIRouter()
log = structlog.get_logger()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

SECRET_KEY = os.environ.get("SECRET_KEY", "legendary-waddle")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")


class Token(BaseModel):
    access_token: str


@router.post("/login")
async def login(token: Token, db: Session = Depends(get_db)):
    try:
        # Use access token to get user info from Google
        userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        headers = {"Authorization": f"Bearer {token.access_token}"}
        response = requests.get(userinfo_url, headers=headers)
        response.raise_for_status()  # Raises an exception for 4XX/5XX responses
        userinfo = response.json()

        # Extract user information
        oauth_provider_id = userinfo["sub"]
        email = userinfo["email"]
        name = userinfo.get("name")

        # Check if user exists
        user = get_user_by_oauth_provider_id(db, oauth_provider_id)

        if not user:
            # Create new user
            user = create_user(db, oauth_provider_id, email, name)
        else:
            log.info("User logged in", user_id=user.id)

        # Create JWT
        access_token_payload = {"sub": str(user.id)}
        access_token = jwt.encode(access_token_payload, SECRET_KEY, algorithm=ALGORITHM)

        return {"access_token": access_token, "token_type": "bearer"}

    except requests.exceptions.RequestException as e:
        log.error("Failed to get user info from Google", error=str(e))
        raise HTTPException(status_code=401, detail="Invalid Google access token") from e
    except (KeyError, jwt.PyJWTError) as e:
        log.error("Login failed", error=str(e))
        raise HTTPException(status_code=401, detail="Invalid token or user info") from e
