from sqlalchemy.orm import Session
from fastapi import HTTPException

from sklearn.model_selection import train_test_split

from app.services.version_service import (
    load_version_dataframe
)

from app.utils.model_factory import (
    CLASSIFICATION_MODELS,
    REGRESSION_MODELS,
    CLUSTERING_MODELS
)
def detect_problem_type(
    df,
    target_column
):

    if target_column is None:

        return "clustering"

    if target_column not in df.columns:

        raise HTTPException(
            status_code=404,
            detail="Target column not found."
        )

    target = df[target_column]

    # Numeric target

    if target.dtype.kind in "if":

        unique = target.nunique()

        if unique <= 10:

            return "classification"

        return "regression"

    return "classification"

def prepare_dataset(
    version_id,
    target_column,
    db
):

    dataset, df = load_dataset(
        dataset_id,
        db
    )

    problem = detect_problem_type(
        df,
        target_column
    )

    if problem == "clustering":

        return {

            "problem_type": problem,

            "X": df

        }

    X = df.drop(
        columns=[target_column]
    )

    y = df[target_column]

    X_train, X_test, y_train, y_test = train_test_split(

        X,

        y,

        test_size=0.2,

        random_state=42

    )

    return {

        "problem_type": problem,

        "X_train": X_train,

        "X_test": X_test,

        "y_train": y_train,

        "y_test": y_test

    }
def get_model(
    algorithm,
    problem_type
):

    if problem_type == "classification":

        models = CLASSIFICATION_MODELS

    elif problem_type == "regression":

        models = REGRESSION_MODELS

    else:

        models = CLUSTERING_MODELS

    if algorithm not in models:

        raise HTTPException(
            status_code=404,
            detail="Algorithm not supported."
        )

    return models[algorithm]
def train_model(request: TrainRequest, db: Session):
    
    version, df = load_training_dataset(...)

    problem_type = detect_problem_type(...)

    X_train, X_test, y_train, y_test = prepare_dataset(...)

    model = get_model(...)

    model.fit(...)

    predictions = model.predict(...)

    metrics = evaluate(...)

    model_path = save_model(...)

    save_trained_model(...)

    return response

def evaluate_model():
    pass


def predict():
    pass