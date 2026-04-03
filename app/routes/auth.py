from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

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
    try:
        new_user = create_user(db, user.name, user.email, user.password)
        return {"message": "User created", "user_id": new_user.id}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"user_id": db_user.id})

    return {"access_token": token}