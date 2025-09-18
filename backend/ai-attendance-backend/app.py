from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import base64
import cv2
import numpy as np
import speech_recognition as sr
from openai import OpenAI

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
     methods=['GET', 'POST', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'])

# --- Hugging Face OpenAI-Compatible API Setup ---
HF_TOKEN = "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"
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN,
)

def get_hf_response(user_input):
    try:
        completion = client.chat.completions.create(
            model="google/gemma-2-2b-it:nebius",
            messages=[{"role": "user", "content": user_input}]
        )
        print(completion)  # Debug print to see the full response
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Hugging Face error: {e}")
        return f"Error: {str(e)}"

# --- Attendance Endpoints ---
@app.route('/attendance/mark', methods=['POST'])
def mark_attendance_endpoint():
    data = request.get_json(force=True)
    roll_number = data.get('roll_number')
    manual = data.get('manual', False)
    if not roll_number:
        return jsonify({"error": "Missing roll_number"}), 400
    return jsonify({"message": "Attendance marked successfully"})

@app.route('/attendance/stats/<roll_number>', methods=['GET'])
def get_stats_endpoint(roll_number):
    stats = {"roll_number": roll_number, "attendance": 90}
    return jsonify(stats)

@app.route('/attendance/manual', methods=['POST'])
def manual_attendance_endpoint():
    data = request.get_json(force=True)
    roll_number = data.get('roll_number')
    code = data.get('code')
    if not roll_number or not code:
        return jsonify({"error": "Missing roll_number or code"}), 400
    return jsonify({"message": "Manual attendance marked"})

# --- Gesture Recognition Endpoint ---
gesture_labels = {
    "open_chat": "🤟",
    "teacher_view": "✊",
    "mark_attendance": "👋"
}

def classify_gesture_opencv(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur1 = cv2.GaussianBlur(gray, (7, 7), 0)
    thresh1 = cv2.adaptiveThreshold(blur1, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
    blur2 = cv2.GaussianBlur(gray, (9, 9), 0)
    _, thresh2 = cv2.threshold(blur2, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    mean_val = np.mean(gray)
    threshold_val = max(80, min(180, int(mean_val * 0.7)))
    _, thresh3 = cv2.threshold(gray, threshold_val, 255, cv2.THRESH_BINARY_INV)

    best_contours = None
    for thresh in [thresh1, thresh2, thresh3]:
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        large_contours = [c for c in contours if cv2.contourArea(c) > 2000]
        if large_contours:
            best_contours = large_contours
            break

    if best_contours is None:
        return "none"

    cnt = max(best_contours, key=cv2.contourArea)
    area = cv2.contourArea(cnt)
    if area < 2000:
        return "none"

    hull_indices = cv2.convexHull(cnt, returnPoints=False)
    finger_count = 0
    if hull_indices is not None and len(hull_indices) >= 4:
        defects = cv2.convexityDefects(cnt, hull_indices)
        if defects is not None:
            defect_count = 0
            for i in range(defects.shape[0]):
                s, e, f, d = defects[i, 0]
                depth_threshold = max(1000, int(area * 0.01))
                if d > depth_threshold:
                    defect_count += 1
            finger_count = min(defect_count + 1, 5)

    if finger_count == 1:
        return "open_chat"
    elif finger_count == 2 or finger_count == 3:
        return "mark_attendance"
    elif finger_count >= 4:
        return "teacher_view"
    else:
        return "none"

@app.route('/api/gesture/detect', methods=['POST', 'OPTIONS'])
def detect_gesture():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.get_json()
        image_data = data.get('image')
        if not image_data:
            return jsonify({'error': 'No image provided'}), 400
        header, encoded = image_data.split(",", 1)
        img_bytes = base64.b64decode(encoded)
        nparr = np.frombuffer(img_bytes, np.uint8)
        if len(nparr) == 0:
            return jsonify({'gesture': 'none', 'emoji': '', 'key': None})
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({'gesture': 'none', 'emoji': '', 'key': None})
        gesture = classify_gesture_opencv(img)
        key = None
        if gesture == "open_chat":
            key = "c"
        elif gesture == "teacher_view":
            key = "t"
        return jsonify({'gesture': gesture, 'emoji': gesture_labels.get(gesture, ""), 'key': key})
    except Exception as e:
        print(f"Gesture detection error: {e}")
        return jsonify({'error': 'Internal server error', 'gesture': 'none', 'emoji': '', 'key': None}), 500

# --- Chatbot Endpoint (uses Hugging Face) ---
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message')
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    response_text = get_hf_response(user_input)
    now = datetime.now()
    response = {
        "id": str(int(now.timestamp() * 1000)),
        "text": response_text,
        "sender": "faculty",
        "timestamp": now.isoformat()
    }
    return jsonify(response), 200

# --- Speech Recognition Endpoint ---
@app.route('/api/speech-to-text', methods=['POST'])
def speech_to_text():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        return jsonify({'text': text})
    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand the audio'}), 400
    except sr.RequestError as e:
        return jsonify({'error': f'Speech Recognition Error: {e}'}), 500

@app.route("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Attendance Query System"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)