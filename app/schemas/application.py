from pydantic import BaseModel

class ApplyTask(BaseModel):
    task_id: str