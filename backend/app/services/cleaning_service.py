import os
import uuid
import pandas as pd
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, MaxAbsScaler, Normalizer
from sklearn.preprocessing import OneHotEncoder, LabelEncoder

from app.services.dataset_service import load_dataset


PROCESSED_FOLDER = "uploads/processed"

os.makedirs(PROCESSED_FOLDER, exist_ok=True)


# ==========================================================
# SAVE CLEANED DATASET
# ==========================================================

def save_processed_dataset(df, operation):

    filename = f"{operation}_{uuid.uuid4().hex[:8]}.csv"

    file_path = os.path.join(
        PROCESSED_FOLDER,
        filename
    )

    df.to_csv(
        file_path,
        index=False
    )

    return file_path


# ==========================================================
# FILL MISSING VALUES
# ==========================================================

def fill_missing_values(
    dataset_id: int,
    column: str,
    method: str,
    db: Session
):

    dataset, df = load_dataset(
        dataset_id,
        db
    )

    if column not in df.columns:

        raise HTTPException(
            status_code=404,
            detail=f"{column} not found."
        )

    method = method.lower()

    if method == "mean":

        if not pd.api.types.is_numeric_dtype(df[column]):

            raise HTTPException(
                status_code=400,
                detail="Mean only works for numeric columns."
            )

        df[column] = df[column].fillna(
            df[column].mean()
        )

    elif method == "median":

        if not pd.api.types.is_numeric_dtype(df[column]):

            raise HTTPException(
                status_code=400,
                detail="Median only works for numeric columns."
            )

        df[column] = df[column].fillna(
            df[column].median()
        )

    elif method == "mode":

        df[column] = df[column].fillna(
            df[column].mode()[0]
        )

    elif method == "drop_rows":

        df = df.dropna(
            subset=[column]
        )

    elif method == "drop_columns":

        df = df.drop(
            columns=[column]
        )

    else:

        raise HTTPException(
            status_code=400,
            detail="Unsupported cleaning method."
        )

    processed_path = save_processed_dataset(
        df,
        "missing_values"
    )

    return {

        "message": "Missing values handled successfully.",

        "method": method,

        "column": column,

        "processed_file": processed_path,

        "rows": int(df.shape[0]),

        "columns": int(df.shape[1])

    }


# ==========================================================
# REMOVE DUPLICATES
# ==========================================================

def remove_duplicates(
    dataset_id: int,
    db: Session
):

    dataset, df = load_dataset(
        dataset_id,
        db
    )

    before = len(df)

    df = df.drop_duplicates()

    after = len(df)

    removed = before - after

    processed_path = save_processed_dataset(
        df,
        "duplicates_removed"
    )

    return {

        "message": "Duplicates removed successfully.",

        "duplicates_removed": int(removed),

        "remaining_rows": int(after),

        "processed_file": processed_path

    }
# ==========================================================
# LABEL ENCODING
# ==========================================================

def label_encode(
    dataset_id: int,
    column: str,
    db: Session
):

    dataset, df = load_dataset(
        dataset_id,
        db
    )

    if column not in df.columns:

        raise HTTPException(
            status_code=404,
            detail=f"{column} not found."
        )

    if pd.api.types.is_numeric_dtype(df[column]):

        raise HTTPException(
            status_code=400,
            detail="Label Encoding only works on categorical columns."
        )

    encoder = LabelEncoder()

    df[column] = encoder.fit_transform(
        df[column].astype(str)
    )

    processed_path = save_processed_dataset(
        df,
        "label_encoded"
    )

    mapping = {}

    for index, label in enumerate(
        encoder.classes_
    ):

        mapping[str(label)] = int(index)

    return {

        "message": "Label Encoding completed.",

        "column": column,

        "mapping": mapping,

        "processed_file": processed_path,

        "rows": int(df.shape[0]),

        "columns": int(df.shape[1])

    }
# ==========================================================
# ONE HOT ENCODING
# ==========================================================

def one_hot_encode(
    dataset_id: int,
    column: str,
    db: Session
):

    dataset, df = load_dataset(
        dataset_id,
        db
    )

    if column not in df.columns:

        raise HTTPException(
            status_code=404,
            detail=f"{column} not found."
        )

    if pd.api.types.is_numeric_dtype(df[column]):

        raise HTTPException(
            status_code=400,
            detail="One Hot Encoding only works on categorical columns."
        )

    df = pd.get_dummies(
        df,
        columns=[column],
        dtype=int
    )

    processed_path = save_processed_dataset(
        df,
        "one_hot_encoded"
    )

    return {

        "message": "One Hot Encoding completed.",

        "column": column,

        "new_columns": list(df.columns),

        "processed_file": processed_path,

        "rows": int(df.shape[0]),

        "columns": int(df.shape[1])

    }
#=========================================================
#                   Scaling Dataset
#=========================================================
def scale_dataset(
    dataset_id: int,
    columns: list[str],
    method: str,
    db: Session
):

    dataset, df = load_dataset(
        dataset_id,
        db
    )

    # Validate columns
    for column in columns:

        if column not in df.columns:

            raise HTTPException(
                status_code=404,
                detail=f"{column} not found."
            )

        if not pd.api.types.is_numeric_dtype(df[column]):

            raise HTTPException(
                status_code=400,
                detail=f"{column} must be numeric."
            )

    method = method.lower()

    scalers = {

        "standard": StandardScaler(),

        "minmax": MinMaxScaler(),

        "robust": RobustScaler(),

        "normalizer": Normalizer(),

        "maxabs": MaxAbsScaler()

    }

    if method not in scalers:

        raise HTTPException(

            status_code=400,

            detail="Unsupported scaling method."

        )

    scaler = scalers[method]

    df[columns] = scaler.fit_transform(
        df[columns]
    )

    processed_path = save_processed_dataset(
        df,
        f"{method}_scaled"
    )

    return {

        "message": "Scaling completed successfully.",

        "method": method,

        "scaled_columns": columns,

        "processed_file": processed_path,

        "rows": int(df.shape[0]),

        "columns": int(df.shape[1])

    }
def detect_outliers(
    dataset_id: int,
    column: str,
    method: str,
    db: Session
):

    dataset, df = load_dataset(dataset_id, db)

    if column not in df.columns:
        raise HTTPException(
            status_code=404,
            detail=f"{column} not found."
        )

    if not pd.api.types.is_numeric_dtype(df[column]):
        raise HTTPException(
            status_code=400,
            detail="Column must be numeric."
        )

    method = method.lower()

    if method == "iqr":

        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)

        IQR = Q3 - Q1

        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR

        indexes = df[
            (df[column] < lower) |
            (df[column] > upper)
        ].index.tolist()

    elif method == "zscore":

        z = np.abs(zscore(df[column].dropna()))

        indexes = df.loc[
            df[column].dropna().index[z > 3]
        ].index.tolist()

    else:

        raise HTTPException(
            status_code=400,
            detail="Method must be iqr or zscore."
        )

    return {

        "column": column,

        "method": method,

        "outliers": len(indexes),

        "indexes": indexes

    }
def remove_outliers(
    dataset_id: int,
    column: str,
    method: str,
    db: Session
):

    dataset, df = load_dataset(dataset_id, db)

    result = detect_outliers(
        dataset_id,
        column,
        method,
        db
    )

    indexes = result["indexes"]

    df = df.drop(index=indexes)

    processed_path = save_processed_dataset(
        df,
        "outliers_removed"
    )

    return {

        "removed": len(indexes),

        "remaining_rows": len(df),

        "processed_file": processed_path

    }
def auto_scale(
    dataset_id: int,
    method: str,
    target_column: str | None,
    db: Session
):

    dataset, df = load_dataset(dataset_id, db)

    numeric = df.select_dtypes(
        include=["number"]
    ).columns.tolist()

    ignore = [

        "id",
        "ID",
        "customerid",
        "CustomerId",
        "RowNumber",
        "Index"
    ]

    numeric = [

        col

        for col in numeric

        if col not in ignore

    ]

    if target_column in numeric:

        numeric.remove(target_column)

    return scale_dataset(

        dataset_id,

        numeric,

        method,

        db

    )
def auto_encode(
    dataset_id: int,
    db: Session
):

    dataset, df = load_dataset(
        dataset_id,
        db
    )

    encoded = []

    for column in df.columns:

        if pd.api.types.is_object_dtype(df[column]):

            unique = df[column].nunique()

            if unique <= 2:

                encoder = LabelEncoder()

                df[column] = encoder.fit_transform(
                    df[column].astype(str)
                )

                encoded.append(
                    {
                        "column": column,
                        "method": "label"
                    }
                )

            else:

                df = pd.get_dummies(
                    df,
                    columns=[column],
                    dtype=int
                )

                encoded.append(
                    {
                        "column": column,
                        "method": "onehot"
                    }
                )

    processed = save_processed_dataset(
        df,
        "auto_encoded"
    )

    return {

        "message": "Auto Encoding completed.",

        "encoded_columns": encoded,

        "processed_file": processed

    }
def auto_preprocess(
    dataset_id: int,
    target_column: str | None,
    db: Session
):

    dataset, df = load_dataset(
        dataset_id,
        db
    )

    report = []

    # Missing values

    for column in df.columns:

        if df[column].isnull().sum():

            if pd.api.types.is_numeric_dtype(df[column]):

                df[column] = df[column].fillna(
                    df[column].median()
                )

            else:

                df[column] = df[column].fillna(
                    df[column].mode()[0]
                )

    report.append(
        "Missing values handled"
    )

    # Remove duplicates

    before = len(df)

    df = df.drop_duplicates()

    report.append(
        f"Removed {before-len(df)} duplicates"
    )

    # Encode

    encoded = []

    for column in list(df.columns):

        if pd.api.types.is_object_dtype(df[column]):

            if df[column].nunique() <= 2:

                encoder = LabelEncoder()

                df[column] = encoder.fit_transform(
                    df[column].astype(str)
                )

                encoded.append(column)

            else:

                df = pd.get_dummies(
                    df,
                    columns=[column],
                    dtype=int
                )

                encoded.append(column)

    report.append(
        f"Encoded {len(encoded)} columns"
    )

    # Scale

    numeric = df.select_dtypes(
        include=["number"]
    ).columns.tolist()

    ignore = [
        "id",
        "ID",
        "CustomerId",
        "customerid",
        "RowNumber"
    ]

    numeric = [

        col

        for col in numeric

        if col not in ignore

    ]

    if target_column in numeric:

        numeric.remove(target_column)

    scaler = StandardScaler()

    df[numeric] = scaler.fit_transform(
        df[numeric]
    )

    report.append(
        f"Scaled {len(numeric)} columns"
    )

    processed = save_processed_dataset(
        df,
        "auto_preprocessed"
    )

    return {

        "message": "Auto preprocessing completed.",

        "steps": report,

        "processed_file": processed,

        "rows": len(df),

        "columns": len(df.columns)

    }
