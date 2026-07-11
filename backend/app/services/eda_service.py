from fastapi import HTTPException
import pandas as pd

from app.services.dataset_service import load_dataset
def visualize_dataset(
    dataset_id,
    chart_type,
    x_column,
    y_column,
    db
):

    dataset, df = load_dataset(dataset_id, db)

    if x_column not in df.columns:
        raise HTTPException(
            status_code=404,
            detail="Column not found"
        )

    chart_type = chart_type.lower()
    if chart_type == "histogram":
        return {
            "chart": "histogram",
            "column": x_column,
            "values": df[x_column].dropna().tolist()
        }
    elif chart_type == "boxplot":
    
        return {
            "chart": "boxplot",
            "column": x_column,
            "values": df[x_column].dropna().tolist()
        }
    elif chart_type == "scatter":
        if y_column is None:
            raise HTTPException(
                status_code=400,
                detail="y_column is required for scatter plot"
            )
        if y_column not in df.columns:
            raise HTTPException(
                status_code=404,
                detail="y_column not found"
            )
        return {
            "chart": "scatter",
            "x_column": x_column,
            "y_column": y_column,
            "x_values": df[x_column].dropna().tolist(),
            "y_values": df[y_column].dropna().tolist()
        }
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid chart type. Supported types: histogram, boxplot, scatter"
        )