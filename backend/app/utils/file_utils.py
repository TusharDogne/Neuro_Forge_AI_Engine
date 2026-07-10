import os
import uuid
import shutil
import pandas as pd

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_uploaded_file(file):
    extension = file.filename.split(".")[-1].lower()

    unique_filename = f"{uuid.uuid4()}.{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return unique_filename, file_path


def read_dataset(file_path):

    if file_path.endswith(".csv"):
        return pd.read_csv(file_path)

    elif file_path.endswith(".xlsx"):
        return pd.read_excel(file_path)

    elif file_path.endswith(".json"):
        return pd.read_json(file_path)

    raise Exception("Unsupported File Format")