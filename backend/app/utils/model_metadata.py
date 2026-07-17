def build_model_response(
    trained_model,
    metrics,
    model_path
):
    return {
        "model_id": trained_model.id,
        "algorithm": trained_model.algorithm,
        "problem_type": trained_model.problem_type,
        "model_path": model_path,
        "metrics": metrics,
        "created_at": trained_model.created_at
    }