from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.services.eda_service import (
    visualize_dataset,
    generate_dashboard
)

router = APIRouter(
    prefix="/eda",
    tags=["EDA"]
)


@router.get("/visualize")
def visualize(
    dataset_id: int,
    chart_type: str,
    x_column: str = None,
    y_column: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return visualize_dataset(
        dataset_id,
        chart_type,
        x_column,
        y_column,
        db
    )


@router.get("/dashboard/{dataset_id}")
def dashboard(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return generate_dashboard(
        dataset_id,
        db
    )