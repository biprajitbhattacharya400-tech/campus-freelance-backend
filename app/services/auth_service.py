from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import hash_password
from app.utils.security import verify_password

def create_user(db: Session, name: str, email: str, password: str):
    hashed_password = hash_password(password)

    new_user = User(
        name=name,
        email=email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user