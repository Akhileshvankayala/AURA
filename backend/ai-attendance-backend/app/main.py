from flask import Flask
from flask_cors import CORS
from app.api.attendance import attendance_api
from app.api.gesture import gesture_api
# from app.api.speech import speech_api  # <-- Commented out for now

app = Flask(__name__)
# Configure CORS to allow requests from frontend
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'], 
     methods=['GET', 'POST', 'OPTIONS'], 
     allow_headers=['Content-Type', 'Authorization'])

app.register_blueprint(attendance_api, url_prefix='/attendance')
app.register_blueprint(gesture_api, url_prefix='/api/gesture')
# app.register_blueprint(speech_api, url_prefix='/api')  # <-- Commented out for now

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Attendance Query System"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)