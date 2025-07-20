from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from workouts import router as workouts_router
from records import router as records_router
from auth import router as auth_router

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(workouts_router)
app.include_router(records_router)
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
