from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.task import TaskCreate
from app.services.task_service import create_task, get_all_tasks
from app.utils.dependencies import get_current_user
from app.models.task import Task

router = APIRouter()

# ✅ Create Task
@router.post("/")
def create_new_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_task = create_task(db, task, current_user.id)

    return {
        "message": "Task created",
        "task_id": new_task.id
    }


# ✅ Get All Tasks
@router.get("/")
def list_tasks(db: Session = Depends(get_db)):
    tasks = get_all_tasks(db)

    return [
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "budget": t.budget,
            "owner_id": t.owner_id,
            "status": t.status
        }
        for t in tasks
    ]

@router.put("/complete/{task_id}")
def complete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    if task.owner_id != current_user.id:
        return {"error": "Not authorized"}

    task.status = "completed"
    db.commit()

    return {"message": "Task completed"}