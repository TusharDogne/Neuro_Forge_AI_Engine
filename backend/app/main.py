from fastapi import FastAPI
from app.models.user import User
from app.db.database import Base, engine


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="NeuroForge API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {"message": "Welcome to the NeuroForge API!"}
