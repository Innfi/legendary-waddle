from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
import jwt
import structlog
import requests
import os

from common.database import get_db
from models import User

router = APIRouter()
log = structlog.get_logger()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login2")

SECRET_KEY = os.environ.get("SECRET_KEY", "legendary-waddle")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")

class Token(BaseModel):
    access_token: str

@router.post("/api/login2")
async def login2(token: Token, db: Session = Depends(get_db)):
    try:
        # Use access token to get user info from Google
        userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        headers = {"Authorization": f"Bearer {token.access_token}"}
        response = requests.get(userinfo_url, headers=headers)
        response.raise_for_status()  # Raises an exception for 4XX/5XX responses
        userinfo = response.json()

        # Extract user information
        oauth_provider_id = userinfo['sub']
        email = userinfo['email']
        name = userinfo.get('name')

        # Check if user exists
        user = db.query(User).filter(User.oauth_provider_id == oauth_provider_id).first()

        if not user:
            # Create new user
            log.info("Creating new user", email=email, oauth_provider_id=oauth_provider_id)
            user = User(oauth_provider_id=oauth_provider_id, email=email, name=name)
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            log.info("User logged in", user_id=user.id)

        # Create JWT
        access_token_payload = {"sub": user.id}
        access_token = jwt.encode(access_token_payload, SECRET_KEY, algorithm=ALGORITHM)

        return {"access_token": access_token, "token_type": "bearer"}

    except requests.exceptions.RequestException as e:
        log.error("Failed to get user info from Google", error=str(e))
        raise HTTPException(status_code=401, detail="Invalid Google access token")
    except (KeyError, jwt.PyJWTError) as e:
        log.error("Login failed", error=str(e))
        raise HTTPException(status_code=401, detail="Invalid token or user info")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user