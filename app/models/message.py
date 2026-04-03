from sqlalchemy import Column, String, ForeignKey
from app.db.base import Base
import uuid

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, ForeignKey("tasks.id"))
    sender_id = Column(String)
    message = Column(String)