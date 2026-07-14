from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    BigInteger
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Dataset(Base):

    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String(255), nullable=False)

    original_filename = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    file_type = Column(String(20), nullable=False)

    file_size = Column(BigInteger, nullable=False)

    rows = Column(Integer)

    columns = Column(Integer)

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    project = relationship(
        "Project",
        back_populates="datasets"
    )
    versions = relationship(
    "DatasetVersion",
    back_populates="dataset",
    cascade="all, delete"
    )