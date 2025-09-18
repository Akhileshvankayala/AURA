from flask import Blueprint, request, jsonify
import base64
import cv2
import numpy as np
import mediapipe as mp

gesture_api = Blueprint('gesture_api', __name__)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1)
gesture_labels = {
    "open_chat": "🤟",
    "teacher_view": "✊",
    "mark_attendance": "👋"
}

def classify_gesture(hand_landmarks):
    lm = hand_landmarks.landmark

    def finger_up(tip, pip):
        return lm[tip].y < lm[pip].y

    thumb_up = finger_up(4, 2)
    index_up = finger_up(8, 6)
    middle_up = finger_up(12, 10)
    ring_up = finger_up(16, 14)
    pinky_up = finger_up(20, 18)

    if index_up and pinky_up and not middle_up and not ring_up and not thumb_up:
        return "open_chat"
    if thumb_up and index_up and middle_up and ring_up and pinky_up:
        return "teacher_view"
    if not thumb_up and index_up and middle_up and ring_up and pinky_up:
        return "mark_attendance"

    return "none"

@gesture_api.route('/api/gesture/detect', methods=['POST'])
def detect_gesture():
    data = request.get_json()
    image_data = data.get('image')
    if not image_data:
        return jsonify({'error': 'No image provided'}), 400
    # Decode base64 image
    header, encoded = image_data.split(",", 1)
    img_bytes = base64.b64decode(encoded)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)
    if results.multi_hand_landmarks:
        gesture = classify_gesture(results.multi_hand_landmarks[0])
    else:
        gesture = "none"

    # Keyboard trigger logic
    key = None
    if gesture == "open_chat":
        key = "c"
    elif gesture == "teacher_view":
        key = "t"
    # "mark_attendance" does not trigger a key

    return jsonify({'gesture': gesture, 'emoji': gesture_labels.get(gesture, ""), 'key': key})