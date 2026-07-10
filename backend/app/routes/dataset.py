from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User
from app.services.dataset_service import upload_dataset_service

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"]
)


@router.post("/upload")
def upload_dataset(
    project_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return upload_dataset_service(
        file=file,
        project_id=project_id,
        db=db
    )