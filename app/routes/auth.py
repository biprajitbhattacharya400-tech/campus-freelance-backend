from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate
from app.services.auth_service import create_user
from app.db.session import get_db

from app.schemas.user import UserLogin
from app.services.auth_service import authenticate_user
from app.utils.security import create_access_token


# 👇 THIS MUST EXIST
router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    new_user = create_user(db, user.name, user.email, user.password)
    return {"message": "User created", "user_id": new_user.id}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        return {"error": "Invalid credentials"}

    token = create_access_token({"user_id": db_user.id})

    return {"access_token": token}