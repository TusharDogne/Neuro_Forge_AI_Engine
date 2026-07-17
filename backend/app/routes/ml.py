from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.services.ml_service import (
    prepare_dataset,
    detect_problem_type
)
from pydantic import BaseModel

router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning"]
)
@router.get("/prepare")
def prepare(

    
    version_id: int,

    target_column: str,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

   return prepare_dataset(
    version_id,
    target_column,
    db
)


class TrainRequest(BaseModel):
    version_id: int
    target_column: str
    algorithm: str
    test_size: float = 0.2
    random_state: int = 42
@router.post("/train")
def train(
    request: TrainRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return train_model(request, db)