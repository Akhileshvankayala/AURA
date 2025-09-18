from flask import Flask
from app.api.attendance import attendance_api
from app.api.gesture import gesture_api  # <-- Add this import

app = Flask(__name__)

# Configuration settings can be added here
app.config['DEBUG'] = True

from app.api import attendance

# Register blueprints or routes here
app.register_blueprint(attendance_api)
app.register_blueprint(gesture_api, url_prefix='/api/gesture')  # <-- Add this line