from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Annotated

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Example user store
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "hashed_password": "fakehashedsecret"
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

def fake_hash_password(password: str):
    return "fakehashed" + password

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict or not fake_hash_password(form_data.password) == user_dict["hashed_password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    # Replace with JWT encode logic!
    token = form_data.username + "_token"
    return {"access_token": token, "token_type": "bearer"}

@app.get("/protected-data/")
async def read_protected(token: Annotated[str, Depends(oauth2_scheme)]):
    # Optionally, verify token validity here
    return {"data": "Here is some protected data", "token": token}
