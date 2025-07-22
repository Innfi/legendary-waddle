from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy.orm import Session
import jwt
import structlog

from common.database import get_db
from models import User

router = APIRouter()
log = structlog.get_logger()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# This should be a secret, but for now we'll hardcode it
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

class Token(BaseModel):
    credential: str

@router.post("/api/login")
async def login(token: Token, db: Session = Depends(get_db)):
    try:
        # Verify the token with Google
        client_id = "970293656109-a5v1j2eu4k3o0ukm5g83et5knlibm31p.apps.googleusercontent.com"
        idinfo = id_token.verify_oauth2_token(token.credential, requests.Request(), client_id)

        # Extract user information
        oauth_provider_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name')

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

    except (ValueError, jwt.PyJWTError) as e:
        log.error("Login failed", error=str(e))
        # Invalid token
        raise HTTPException(status_code=401, detail="Invalid Google token")

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