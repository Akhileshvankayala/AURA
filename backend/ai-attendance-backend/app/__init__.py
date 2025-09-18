from flask import Flask

app = Flask(__name__)

# Configuration settings can be added here
app.config['DEBUG'] = True

from app.api import attendance

# Register blueprints or routes here
app.register_blueprint(attendance.bp)