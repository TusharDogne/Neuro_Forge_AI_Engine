from sqlalchemy.orm import Session

from app.models.dataset_version import DatasetVersion
def get_latest_version(
    dataset_id: int,
    db: Session
):

    return (
        db.query(DatasetVersion)
        .filter(
            DatasetVersion.dataset_id == dataset_id
        )
        .order_by(
            DatasetVersion.version.desc()
        )
        .first()
    )
def create_version(
    dataset_id: int,
    operation: str,
    file_path: str,
    db: Session
):

    latest = get_latest_version(
        dataset_id,
        db
    )

    if latest:

        version = latest.version + 1

        parent = latest.id

    else:

        version = 1

        parent = None

    new_version = DatasetVersion(

        dataset_id=dataset_id,

        version=version,

        operation=operation,

        file_path=file_path,

        parent_version_id=parent

    )

    db.add(new_version)

    db.commit()

    db.refresh(new_version)

    return new_version
def get_version(
    version_id: int,
    db: Session
):

    return (

        db.query(DatasetVersion)

        .filter(
            DatasetVersion.id == version_id
        )

        .first()

    )
def get_dataset_versions(
    dataset_id: int,
    db: Session
):

    versions = (

        db.query(DatasetVersion)

        .filter(
            DatasetVersion.dataset_id == dataset_id
        )

        .order_by(
            DatasetVersion.version.asc()
        )

        .all()

    )

    return versions
def rollback_version(
    version_id: int,
    db: Session
):

    version = (
        db.query(DatasetVersion)
        .filter(
            DatasetVersion.id == version_id
        )
        .first()
    )

    if not version:

        raise HTTPException(
            status_code=404,
            detail="Version not found."
        )

    return {

        "message": "Rollback successful.",

        "current_version": version.version,

        "file_path": version.file_path

    }