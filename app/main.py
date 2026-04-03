from fastapi import FastAPI

# 👇 ADD THESE
from app.db.base import Base
from app.db.session import engine
from app import models  # Registers all models

from app.routes import auth
from app.routes import user
from app.routes import task
from app.db import base_models
from app.routes import application
from app.routes import chat


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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