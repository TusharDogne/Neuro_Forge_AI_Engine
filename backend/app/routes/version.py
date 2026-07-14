from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.services.version_service import (
    get_dataset_versions,
    get_version,
    rollback_version
)

router = APIRouter(
    prefix="/versions",
    tags=["Dataset Versions"]
)
@router.get("/{dataset_id}")
def list_versions(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    versions = get_dataset_versions(
        dataset_id,
        db
    )

    return [
        {
            "id": version.id,
            "version": version.version,
            "operation": version.operation,
            "file_path": version.file_path,
            "created_at": version.created_at
        }
        for version in versions
    ]
@router.get("/details/{version_id}")
def version_details(
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    version = get_version(
        version_id,
        db
    )

    if not version:
        raise HTTPException(
            status_code=404,
            detail="Version not found."
        )

    return {
        "id": version.id,
        "dataset_id": version.dataset_id,
        "version": version.version,
        "operation": version.operation,
        "file_path": version.file_path,
        "parent_version_id": version.parent_version_id,
        "created_at": version.created_at
    }
@router.post("/rollback/{version_id}")
def rollback(
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return rollback_version(
        version_id,
        db
    )