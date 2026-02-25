from datetime import datetime, timedelta, timezone
from typing import Annotated, Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext

SECRET_KEY = "your-super-secret-key-change-this-in-prod-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

fake_users_db = {
    "admin": {
        "username": "admin",
        "full_name": "Administrator",
        "email": "admin@example.com",
        "hashed_password": pwd_context.hash("adminsecure2026"),
        "role": "admin",
    },
    "host": {
        "username": "host",
        "full_name": "Meeting Host",
        "email": "host@example.com",
        "hashed_password": pwd_context.hash("hostpass456"),
        "role": "meeting_host",
    },
    "participant": {
        "username": "participant",
        "full_name": "Participant",
        "email": "participant@example.com",
        "hashed_password": pwd_context.hash("participant789"),
        "role": "participant",
    },
}

class User:
    def __init__(self, username: str, role: str, **data):
        self.username = username
        self.role = role
        for k, v in data.items():
            setattr(self, k, v)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(username: str):
    if user_dict := fake_users_db.get(username):
        return User(**user_dict)

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(username)
    if user is None:
        raise credentials_exception
    return user

def require_role(allowed_roles: list[str]):
    async def role_checker(current_user: Annotated[User, Depends(get_current_user)]):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Required role: one of {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

def get_current_user_or_system():
    async def dependency(token: Annotated[str, Depends(oauth2_scheme)] = None):
        if token is None:
            return User(username="system_ai_agent", role="ai")
        return await get_current_user(token)
    return dependency

admin_or_host = require_role(["admin", "meeting_host"])
admin_only = require_role(["admin"])
host_only = require_role(["meeting_host"])
participant_or_higher = require_role(["admin", "meeting_host", "participant"])
ai_or_system = require_role(["ai"])
