from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.services.eda_service import visualize_dataset

router = APIRouter(
    prefix="/eda",
    tags=["EDA"]
)


@router.get("/visualize")
def visualize(
    dataset_id: int,
    chart_type: str = Query(...),
    x_column: str = Query(...),
    y_column: str | None = None,
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