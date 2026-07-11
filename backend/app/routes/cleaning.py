from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.cleaning_service import (
    fill_missing_values,
    remove_duplicates,
    label_encode,
    one_hot_encode,
    scale_dataset
)



router = APIRouter(
    prefix="/cleaning",
    tags=["Cleaning"]
)


@router.post("/fill-missing")
def fill_missing(
    dataset_id: int,
    column: str,
    method: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return fill_missing_values(
        dataset_id,
        column,
        method,
        db
    )


@router.post("/remove-duplicates")
def delete_duplicates(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return remove_duplicates(
        dataset_id,
        db
    )
from app.services.cleaning_service import (
    fill_missing_values,
    remove_duplicates,
    label_encode,
    one_hot_encode
)
@router.post("/label-encode")
def encode_label(

    dataset_id: int,

    column: str,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    return label_encode(

        dataset_id,

        column,

        db

    )
@router.post("/one-hot-encode")
def encode_one_hot(

    dataset_id: int,

    column: str,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    return one_hot_encode(

        dataset_id,

        column,

        db

    )
@router.post("/scale")
def scale(

    dataset_id: int,

    columns: list[str],

    method: str,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    return scale_dataset(

        dataset_id,

        columns,

        method,

        db

    )