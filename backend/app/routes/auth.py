from fastapi import APIRouter
from app.schemas.user import UserCreate

router = APIRouter()

@router.post("/register")
def register(user: UserCreate):
    return user