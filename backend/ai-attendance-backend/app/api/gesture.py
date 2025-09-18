from flask import Blueprint, request, jsonify
import base64
import cv2
import numpy as np

gesture_api = Blueprint('gesture_api', __name__)

gesture_labels = {
    "open_chat": "🤟",
    "teacher_view": "✊",
    "mark_attendance": "👋"
}

def classify_gesture_opencv(img):
    # Convert to grayscale and blur
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (15, 15), 0)  # Less blur for more detail
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    print(f"Contours found: {len(contours)}")
    if len(contours) == 0:
        print("No hand detected.")
        return "none"

    # Assume largest contour is hand
    cnt = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(cnt)
    print(f"Largest contour area: {area}")
    if area < 1000:  # Ignore small contours
        print("Contour too small to be a hand.")
        return "none"

    hull = cv2.convexHull(cnt, returnPoints=False)
    if hull is None or len(hull) < 3:
        print("No hand detected (hull issue).")
        return "none"

    defects = cv2.convexityDefects(cnt, hull)
    if defects is None:
        print("No convexity defects found.")
        return "none"

    finger_count = 0
    for i in range(defects.shape[0]):
        s, e, f, d = defects[i, 0]
        print(f"Defect depth: {d}")
        if d > 3000:  # Loosen threshold for defect depth
            finger_count += 1

    print(f"Finger count detected: {finger_count}")

    # Map finger count to gesture (loosened logic)
    if finger_count == 0 or finger_count == 1:
        return "open_chat"
    elif finger_count >= 4:
        return "teacher_view"
    elif finger_count == 2 or finger_count == 3:
        return "mark_attendance"
    else:
        return "none"

@gesture_api.route('/detect', methods=['POST', 'OPTIONS'])
def detect_gesture():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    image_data = data.get('image')
    if not image_data:
        return jsonify({'error': 'No image provided'}), 400
    # Decode base64 image
    header, encoded = image_data.split(",", 1)
    img_bytes = base64.b64decode(encoded)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    gesture = classify_gesture_opencv(img)

    key = None
    if gesture == "open_chat":
        key = "c"
    elif gesture == "teacher_view":
        key = "t"
    # "mark_attendance" does not trigger a key

    return jsonify({'gesture': gesture, 'emoji': gesture_labels.get(gesture, ""), 'key': key})