from fastapi import FastAPI

# 👇 ADD THESE
from app.db.base import Base
from app.db.session import engine
from app.models import user  # VERY IMPORTANT

from app.routes import auth
from app.routes import user
from app.routes import task
from app.db import base_models
from app.routes import application
from app.routes import chat



app = FastAPI()

# 👇 ADD THIS (creates tables)
Base.metadata.create_all(bind=engine)

app.include_router(user.router, prefix="/user")

app.include_router(auth.router, prefix="/auth")

app.include_router(task.router, prefix="/tasks")

app.include_router(application.router, prefix="/applications")

app.include_router(chat.router, prefix="/chat")

@app.get("/")
def home():
    return {"message": "Campus Freelance Backend Running 🚀"}