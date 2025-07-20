
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import json
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter()

class Token(BaseModel):
    credential: str

@router.post("/api/login")
async def login(token: Token):
    try:
        # Verify the token with Google
        client_id = "970293656109-a5v1j2eu4k3o0ukm5g83et5knlibm31p.apps.googleusercontent.com"
        idinfo = id_token.verify_oauth2_token(token.credential, requests.Request(), client_id)

        # Extract user information
        userid = idinfo['sub']
        email = idinfo['email']
        name = idinfo['name']

        print(f"userid: {userid}")
        print(f"email: {email}")
        print(f"name: {name}")

        # Store user information in db.json
        # with open('db.json', 'r+') as f:
        #     data = json.load(f)
        #     data['users'][userid] = {"email": email, "name": name}
        #     f.seek(0)
        #     json.dump(data, f, indent=4)

        # For now, we'll just return a success message
        # In a real app, you'd return a session token or JWT
        return {"message": "Login successful", "user": {"id": userid, "email": email, "name": name}}

    except ValueError:
        # Invalid token
        raise HTTPException(status_code=401, detail="Invalid Google token")
