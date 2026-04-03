from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.application import ApplyTask
from app.services.application_service import apply_to_task
from app.utils.dependencies import get_current_user
from app.models.application import Application

router = APIRouter()

@router.post("/")
def apply(
    task: ApplyTask,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    application = apply_to_task(db, task.task_id, current_user.id)

    return {
        "message": "Applied successfully",
        "application_id": application.id
    }

@router.get("/task/{task_id}")
def get_applications(task_id: str, db: Session = Depends(get_db)):
    applications = db.query(Application).filter(Application.task_id == task_id).all()

    return [
        {
            "application_id": app.id,
            "task_id": app.task_id,
            "user_id": app.user_id
        }
        for app in applications
    ]