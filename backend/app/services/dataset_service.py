import os
from sqlalchemy.orm import Session

from app.models.dataset import Dataset
from app.utils.file_utils import save_uploaded_file, read_dataset
from fastapi import HTTPException
from app.utils.file_utils import read_dataset



def upload_dataset_service(file, project_id: int, db: Session):

    # Save file
    filename, file_path = save_uploaded_file(file)

    # Read dataset
    df = read_dataset(file_path)

    # Get file extension
    file_type = os.path.splitext(file.filename)[1].replace(".", "")

    # Create Dataset object
    dataset = Dataset(
        filename=filename,
        original_filename=file.filename,
        file_path=file_path,
        file_type=file_type,
        file_size=os.path.getsize(file_path),
        rows=df.shape[0],
        columns=df.shape[1],
        project_id=project_id
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return {
        "message": "Dataset uploaded successfully",
        "dataset_id": dataset.id,
        "filename": dataset.original_filename,
        "rows": dataset.rows,
        "columns": dataset.columns
    }



def get_dataset_preview(dataset_id: int, db: Session):

    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    df = read_dataset(dataset.file_path)

# Convert NaN to None
    df = df.where(df.notna(), None)

    return {
    "dataset_id": dataset.id,
    "filename": dataset.original_filename,
    "rows": dataset.rows,
    "columns": dataset.columns,
    "column_names": list(df.columns),
    "data_types": {
        col: str(dtype)
        for col, dtype in df.dtypes.items()
    },
    "preview": df.head(10).to_dict(orient="records")
}


def load_dataset(dataset_id: int, db: Session):

    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    df = read_dataset(dataset.file_path)

    return dataset, df
def get_missing_values(dataset_id: int, db: Session):

    dataset, df = load_dataset(dataset_id, db)

    missing = (
        df.isnull()
        .sum()
        .to_dict()
    )

    total_missing = int(df.isnull().sum().sum())

    return {
        "dataset_id": dataset.id,
        "filename": dataset.original_filename,
        "total_missing_values": total_missing,
        "column_wise_missing": missing
    }
def get_duplicate_rows(dataset_id: int, db: Session):
    
    dataset, df = load_dataset(dataset_id, db)

    duplicates = int(df.duplicated().sum())

    return {
        "dataset_id": dataset.id,
        "filename": dataset.original_filename,
        "duplicate_rows": duplicates
    }
