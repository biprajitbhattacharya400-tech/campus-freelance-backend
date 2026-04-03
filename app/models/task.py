from sqlalchemy import Column, String, Integer, ForeignKey
from app.db.base import Base
import uuid

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    budget = Column(Integer, nullable=False)

    owner_id = Column(String, ForeignKey("users.id"))
    status = Column(String, default="open")

    assigned_to = Column(String, nullable=True)