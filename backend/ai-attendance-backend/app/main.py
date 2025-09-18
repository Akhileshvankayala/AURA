from fastapi import FastAPI
from app.api import attendance

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Attendance Query System"}

# Include the attendance API routes
app.include_router(attendance.router)