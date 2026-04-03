from sqlalchemy import Column, String, ForeignKey
from app.db.base import Base
import uuid

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, ForeignKey("tasks.id"))
    user_id = Column(String, ForeignKey("users.id"))