import os
import uuid
import joblib

MODEL_FOLDER = "saved_models"

os.makedirs(
    MODEL_FOLDER,
    exist_ok=True
)


def save_model(model):

    filename = (
        uuid.uuid4().hex +
        ".pkl"
    )

    path = os.path.join(
        MODEL_FOLDER,
        filename
    )

    joblib.dump(
        model,
        path
    )

    return path


def load_model(path):

    return joblib.load(path)