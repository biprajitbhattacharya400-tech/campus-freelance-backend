from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.message import Message
from app.utils.dependencies import get_current_user

router = APIRouter()

@router.post("/")
def send_message(task_id: str, message: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    msg = Message(
        task_id=task_id,
        sender_id=current_user.id,
        message=message
    )

    db.add(msg)
    db.commit()
    db.refresh(msg)

    return {"message": "Sent"}


@router.get("/{task_id}")
def get_messages(task_id: str, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.task_id == task_id).all()

    return messages