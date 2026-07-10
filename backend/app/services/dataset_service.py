import os

from sqlalchemy.orm import Session

from app.models.dataset import Dataset
from app.utils.file_utils import save_uploaded_file, read_dataset


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