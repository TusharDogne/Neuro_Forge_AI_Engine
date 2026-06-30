from fastapi import FastAPI

app = FastAPI(
    title="NeuroForge API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {"message": "NeuroForge API Running"}