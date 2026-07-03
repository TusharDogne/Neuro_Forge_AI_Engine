from fastapi import FastAPI
from app.models.user import User
from app.db.database import Base, engine
from app.routes.auth import router
from app.models.user import User
from app.models.project import Project
from app.routes.project import router as project_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="NeuroForge API",
    version="1.0.0"
)
app.include_router(router)
app.include_router(project_router)

@app.get("/")
def home():
    return {"message": "Welcome to the NeuroForge API!"}


