from fastapi import FastAPI
from workouts import router as workouts_router
from records import router as records_router

app = FastAPI()

app.include_router(workouts_router)
app.include_router(records_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
