from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User
from app.services.dataset_service import upload_dataset_service 
from app.services.dataset_service import (
  
    get_dataset_preview,
    get_missing_values,
    get_duplicate_rows,
    get_data_types,
    get_summary
)

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
from app.services.dataset_service import (
    upload_dataset_service,
    get_dataset_preview
)

@router.get("/{dataset_id}/preview")
def preview_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_dataset_preview(
        dataset_id,
        db
    )
@router.get("/{dataset_id}/missing")
def missing_values(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_missing_values(dataset_id, db)
@router.get("/{dataset_id}/duplicates")
def duplicate_rows(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_duplicate_rows(dataset_id, db)

@router.get("/{dataset_id}/summary")
def dataset_summary(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_summary(
        dataset_id,
        db
    )