from fastapi import HTTPException
from sqlalchemy.orm import Session

import pandas as pd
import numpy as np

from app.services.dataset_service import load_dataset


# ==========================================================
# COLUMN VALIDATION
# ==========================================================

def validate_column(df, column):

    if column not in df.columns:
        raise HTTPException(
            status_code=404,
            detail=f"Column '{column}' not found."
        )


def validate_numeric(df, column):

    validate_column(df, column)

    if not pd.api.types.is_numeric_dtype(df[column]):
        raise HTTPException(
            status_code=400,
            detail=f"'{column}' must be a numerical column."
        )


def validate_categorical(df, column):

    validate_column(df, column)

    if pd.api.types.is_numeric_dtype(df[column]):
        raise HTTPException(
            status_code=400,
            detail=f"'{column}' must be a categorical column."
        )


# ==========================================================
# COMMON HELPERS
# ==========================================================

def remove_nulls(series):

    return series.dropna()


def convert_numpy(value):

    """
    Converts NumPy data types into Python data types
    so FastAPI can serialize them.
    """

    if isinstance(value, np.integer):
        return int(value)

    if isinstance(value, np.floating):
        return float(value)

    return value


def json_safe(data):

    """
    Converts dictionaries/lists containing numpy
    values into JSON serializable objects.
    """

    if isinstance(data, dict):

        return {
            k: json_safe(v)
            for k, v in data.items()
        }

    if isinstance(data, list):

        return [
            json_safe(i)
            for i in data
        ]

    return convert_numpy(data)


# ==========================================================
# CHART FUNCTIONS
# ==========================================================


def generate_histogram(df, column):

    validate_numeric(df, column)

    values = remove_nulls(
        df[column]
    ).tolist()

    return {
        "chart": "histogram",
        "title": f"{column} Distribution",
        "column": column,
        "values": values
    }


def generate_boxplot(df, column):

    validate_numeric(df, column)

    values = remove_nulls(
        df[column]
    ).tolist()

    return {
        "chart": "boxplot",
        "title": f"{column} Box Plot",
        "column": column,
        "values": values
    }


def generate_scatter(df, x_column, y_column):

    validate_numeric(df, x_column)
    validate_numeric(df, y_column)

    temp = df[
        [x_column, y_column]
    ].dropna()

    points = []

    for _, row in temp.iterrows():

        points.append(
            {
                "x": convert_numpy(row[x_column]),
                "y": convert_numpy(row[y_column])
            }
        )

    return {

        "chart": "scatter",

        "title": f"{x_column} vs {y_column}",

        "x_column": x_column,

        "y_column": y_column,

        "points": points

    }


def generate_line(df, column):

    validate_numeric(df, column)

    values = remove_nulls(
        df[column]
    ).tolist()

    return {

        "chart": "line",

        "title": f"{column} Trend",

        "column": column,

        "values": values

    }
# ==========================================================
# DISTRIBUTION PLOT
# ==========================================================

def generate_distribution(df, column):

    validate_numeric(df, column)

    values = remove_nulls(
        df[column]
    ).tolist()

    return {

        "chart": "distribution",

        "title": f"{column} Distribution",

        "column": column,

        "values": values

    }


# ==========================================================
# VIOLIN PLOT
# ==========================================================

def generate_violin(df, column):

    validate_numeric(df, column)

    values = remove_nulls(
        df[column]
    ).tolist()

    return {

        "chart": "violin",

        "title": f"{column} Violin Plot",

        "column": column,

        "values": values

    }


# ==========================================================
# BAR CHART
# ==========================================================

def generate_bar(df, column):

    validate_categorical(df, column)

    counts = (
        df[column]
        .value_counts(dropna=False)
        .to_dict()
    )

    return {

        "chart": "bar",

        "title": f"{column} Bar Chart",

        "column": column,

        "labels": list(counts.keys()),

        "values": [
            convert_numpy(v)
            for v in counts.values()
        ]

    }


# ==========================================================
# PIE CHART
# ==========================================================

def generate_pie(df, column):

    validate_categorical(df, column)

    counts = (
        df[column]
        .value_counts(dropna=False)
        .to_dict()
    )

    return {

        "chart": "pie",

        "title": f"{column} Pie Chart",

        "column": column,

        "labels": list(counts.keys()),

        "values": [
            convert_numpy(v)
            for v in counts.values()
        ]

    }


# ==========================================================
# COUNT PLOT
# ==========================================================

def generate_countplot(df, column):

    validate_categorical(df, column)

    counts = (
        df[column]
        .value_counts(dropna=False)
        .to_dict()
    )

    return {

        "chart": "countplot",

        "title": f"{column} Count Plot",

        "column": column,

        "labels": list(counts.keys()),

        "values": [
            convert_numpy(v)
            for v in counts.values()
        ]

    }
# ==========================================================
# CORRELATION HEATMAP
# ==========================================================

def generate_heatmap(df):

    numeric_df = df.select_dtypes(include=["number"])

    if numeric_df.empty:
        raise HTTPException(
            status_code=400,
            detail="Dataset contains no numerical columns."
        )

    correlation = numeric_df.corr().fillna(0)

    return {

        "chart": "heatmap",

        "title": "Correlation Heatmap",

        "columns": correlation.columns.tolist(),

        "matrix": json_safe(
            correlation.values.tolist()
        )

    }


# ==========================================================
# CORRELATION MATRIX
# ==========================================================

def generate_correlation_matrix(df):

    numeric_df = df.select_dtypes(include=["number"])

    if numeric_df.empty:
        raise HTTPException(
            status_code=400,
            detail="Dataset contains no numerical columns."
        )

    correlation = numeric_df.corr()

    return {

        "chart": "correlation_matrix",

        "data": json_safe(
            correlation.to_dict()
        )

    }


# ==========================================================
# PAIR PLOT DATA
# ==========================================================

def generate_pairplot(df):

    numeric_df = df.select_dtypes(include=["number"])

    if numeric_df.shape[1] < 2:
        raise HTTPException(
            status_code=400,
            detail="Pairplot requires at least two numerical columns."
        )

    return {

        "chart": "pairplot",

        "columns": numeric_df.columns.tolist(),

        "data": json_safe(
            numeric_df.to_dict(
                orient="records"
            )
        )

    }


# ==========================================================
# DATASET OVERVIEW
# ==========================================================

def generate_dataset_overview(df):

    return {

        "rows": int(df.shape[0]),

        "columns": int(df.shape[1]),

        "missing_values": int(
            df.isnull().sum().sum()
        ),

        "duplicate_rows": int(
            df.duplicated().sum()
        ),

        "memory_usage_mb": round(
            df.memory_usage(deep=True).sum() /
            (1024 * 1024),
            2
        ),

        "numerical_columns": df.select_dtypes(
            include=["number"]
        ).columns.tolist(),

        "categorical_columns": df.select_dtypes(
            exclude=["number"]
        ).columns.tolist()

    }


# ==========================================================
# AUTO CHART RECOMMENDATION
# ==========================================================

def recommend_charts(df):

    recommendations = []

    numeric_columns = df.select_dtypes(
        include=["number"]
    ).columns.tolist()

    categorical_columns = df.select_dtypes(
        exclude=["number"]
    ).columns.tolist()

    # Histogram + Box + Distribution

    for col in numeric_columns:

        recommendations.append({
            "chart": "histogram",
            "column": col
        })

        recommendations.append({
            "chart": "boxplot",
            "column": col
        })

        recommendations.append({
            "chart": "distribution",
            "column": col
        })

    # Scatter

    if len(numeric_columns) >= 2:

        recommendations.append({

            "chart": "scatter",

            "x_column": numeric_columns[0],

            "y_column": numeric_columns[1]

        })

    # Heatmap

    if len(numeric_columns) >= 2:

        recommendations.append({

            "chart": "heatmap"

        })

    # Pie + Bar + Countplot

    for col in categorical_columns:

        recommendations.append({

            "chart": "bar",

            "column": col

        })

        recommendations.append({

            "chart": "pie",

            "column": col

        })

        recommendations.append({

            "chart": "countplot",

            "column": col

        })

    return recommendations
# ==========================================================
# CHART DISPATCHER
# ==========================================================

CHART_HANDLERS = {
    "histogram": generate_histogram,
    "boxplot": generate_boxplot,
    "scatter": generate_scatter,
    "line": generate_line,
    "distribution": generate_distribution,
    "violin": generate_violin,
    "bar": generate_bar,
    "pie": generate_pie,
    "countplot": generate_countplot,
    "heatmap": generate_heatmap,
    "correlation": generate_correlation_matrix,
    "pairplot": generate_pairplot,
}


# ==========================================================
# VISUALIZATION ENGINE
# ==========================================================

def visualize_dataset(
    dataset_id: int,
    chart_type: str,
    x_column: str = None,
    y_column: str = None,
    db: Session = None
):

    dataset, df = load_dataset(dataset_id, db)

    chart_type = chart_type.lower()

    if chart_type not in CHART_HANDLERS:

        raise HTTPException(
            status_code=400,
            detail=f"Unsupported chart '{chart_type}'"
        )

    handler = CHART_HANDLERS[chart_type]

    if chart_type in [
        "scatter"
    ]:

        if not y_column:

            raise HTTPException(
                status_code=400,
                detail="Scatter plot requires y_column."
            )

        return handler(
            df,
            x_column,
            y_column
        )

    elif chart_type in [
        "heatmap",
        "correlation",
        "pairplot"
    ]:

        return handler(df)

    else:

        if not x_column:

            raise HTTPException(
                status_code=400,
                detail="x_column is required."
            )

        return handler(
            df,
            x_column
        )


# ==========================================================
# COMPLETE EDA DASHBOARD
# ==========================================================

def generate_dashboard(
    dataset_id: int,
    db: Session
):

    dataset, df = load_dataset(
        dataset_id,
        db
    )

    dashboard = {

        "dataset": {

            "id": dataset.id,

            "name": dataset.original_filename,

            "rows": dataset.rows,

            "columns": dataset.columns

        },

        "overview": generate_dataset_overview(df),

        "summary": json_safe(
            df.describe(
                include="all"
            ).fillna("").to_dict()
        ),

        "missing_values": json_safe(
            df.isnull()
            .sum()
            .to_dict()
        ),

        "duplicates": int(
            df.duplicated().sum()
        ),

        "correlation": generate_correlation_matrix(df),

        "recommended_charts":
            recommend_charts(df)

    }

    return dashboard