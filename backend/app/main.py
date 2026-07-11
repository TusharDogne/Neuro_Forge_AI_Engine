from fastapi import FastAPI
from app.db.database import Base, engine
from app.routes.auth import router
from app.models.user import User
from app.models.project import Project
from app.routes.project import router as project_router
from app.models.dataset import Dataset
from app.routes.dataset import router as dataset_router
from app.routes.eda import router as eda_router
from app.routes.cleaning import router as cleaning_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="NeuroForge API",
    version="1.0.0"
)
app.include_router(router)
app.include_router(project_router)
app.include_router(dataset_router)
app.include_router(eda_router)
app.include_router(cleaning_router)

@app.get("/")
def home():
    return {"message": "Welcome to the NeuroForge API!"}


