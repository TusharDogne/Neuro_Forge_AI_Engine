from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class DatasetVersion(Base):

    __tablename__ = "dataset_versions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    dataset_id = Column(
        Integer,
        ForeignKey("datasets.id"),
        nullable=False
    )

    version = Column(
        Integer,
        nullable=False
    )

    operation = Column(
        String(200),
        nullable=False
    )

    file_path = Column(
        String(500),
        nullable=False
    )

    parent_version_id = Column(
        Integer,
        ForeignKey("dataset_versions.id"),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    dataset = relationship(
        "Dataset",
        back_populates="versions"
    )

    parent = relationship(
        "DatasetVersion",
        remote_side=[id]
    )