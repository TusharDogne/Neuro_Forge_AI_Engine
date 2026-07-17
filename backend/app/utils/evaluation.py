from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,

    mean_absolute_error,
    mean_squared_error,
    r2_score,

    silhouette_score,
    davies_bouldin_score,
    calinski_harabasz_score
)

import math
def evaluate_classification(
    y_true,
    y_pred,
    y_probability=None
):

    metrics = {

        "accuracy":
            accuracy_score(
                y_true,
                y_pred
            ),

        "precision":
            precision_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0
            ),

        "recall":
            recall_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0
            ),

        "f1_score":
            f1_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0
            )
    }

    if y_probability is not None:

        try:

            metrics["roc_auc"] = roc_auc_score(
                y_true,
                y_probability,
                multi_class="ovr"
            )

        except Exception:

            metrics["roc_auc"] = None

    else:

        metrics["roc_auc"] = None

    return metrics
def evaluate_regression(
    y_true,
    y_pred
):

    mse = mean_squared_error(
        y_true,
        y_pred
    )

    return {

        "mae":
            mean_absolute_error(
                y_true,
                y_pred
            ),

        "mse":
            mse,

        "rmse":
            math.sqrt(mse),

        "r2_score":
            r2_score(
                y_true,
                y_pred
            )
    }
def evaluate_clustering(
    X,
    labels
):

    return {

        "silhouette":
            silhouette_score(
                X,
                labels
            ),

        "davies_bouldin":
            davies_bouldin_score(
                X,
                labels
            ),

        "calinski_harabasz":
            calinski_harabasz_score(
                X,
                labels
            )
    }