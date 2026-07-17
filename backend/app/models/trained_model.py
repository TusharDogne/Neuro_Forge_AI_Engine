from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class TrainedModel(Base):

    __tablename__ = "trained_models"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(200),
        nullable=False
    )

    algorithm = Column(
        String(100),
        nullable=False
    )

    problem_type = Column(
        String(50),
        nullable=False
    )

    dataset_version_id = Column(
        Integer,
        ForeignKey("dataset_versions.id")
    )

    target_column = Column(
        String(100)
    )

    accuracy = Column(Float)

    precision = Column(Float)

    recall = Column(Float)

    f1_score = Column(Float)

    roc_auc = Column(Float)

    model_path = Column(
        String(500)
    )

    training_time = Column(Float)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    dataset_version = relationship(
        "DatasetVersion"
    )