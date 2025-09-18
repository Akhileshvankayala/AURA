from flask import Flask
from app.api.attendance import attendance_api
from app.api.gesture import gesture_api

app = Flask(__name__)

app.register_blueprint(attendance_api, url_prefix='/attendance')
app.register_blueprint(gesture_api, url_prefix='/api/gesture')

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Attendance Query System"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)