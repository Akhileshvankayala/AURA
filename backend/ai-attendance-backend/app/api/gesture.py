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
    """
    Improved gesture recognition using multiple detection methods
    """
    # Convert to grayscale and apply adaptive preprocessing
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Try multiple preprocessing approaches
    # Method 1: Adaptive threshold
    blur1 = cv2.GaussianBlur(gray, (7, 7), 0)
    thresh1 = cv2.adaptiveThreshold(blur1, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
    
    # Method 2: OTSU threshold
    blur2 = cv2.GaussianBlur(gray, (9, 9), 0)
    _, thresh2 = cv2.threshold(blur2, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Method 3: Simple threshold based on image brightness
    mean_val = np.mean(gray)
    threshold_val = max(80, min(180, int(mean_val * 0.7)))  # Adaptive threshold
    _, thresh3 = cv2.threshold(gray, threshold_val, 255, cv2.THRESH_BINARY_INV)
    
    # Try each threshold method and find the best contours
    best_contours = None
    best_method = "none"
    
    for i, thresh in enumerate([thresh1, thresh2, thresh3], 1):
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if len(contours) > 0:
            # Filter contours by area
            large_contours = [c for c in contours if cv2.contourArea(c) > 2000]
            if large_contours:
                best_contours = large_contours
                best_method = f"method_{i}"
                print(f"Using threshold method {i}, found {len(large_contours)} large contours")
                break
    
    if best_contours is None:
        print("No suitable contours found with any method.")
        return "none"

    # Use the largest contour as the hand
    cnt = max(best_contours, key=cv2.contourArea)
    area = cv2.contourArea(cnt)
    print(f"Largest contour area: {area}")
    
    if area < 2000:  # Minimum area for a hand
        print("Contour too small to be a hand.")
        return "none"

    # Get contour properties for gesture classification
    x, y, w, h = cv2.boundingRect(cnt)
    aspect_ratio = float(w) / h
    extent = float(area) / (w * h)
    
    # Calculate contour approximation
    epsilon = 0.02 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    
    # Calculate solidity (contour area / convex hull area)
    hull = cv2.convexHull(cnt)
    hull_area = cv2.contourArea(hull)
    solidity = float(area) / hull_area if hull_area > 0 else 0
    
    print(f"Contour properties - Area: {area}, Aspect ratio: {aspect_ratio:.2f}, Extent: {extent:.2f}, Solidity: {solidity:.2f}, Approx vertices: {len(approx)}")
    
    # Method 1: Try convexity defects if available
    finger_count = 0
    
    try:
        hull_indices = cv2.convexHull(cnt, returnPoints=False)
        if hull_indices is not None and len(hull_indices) >= 4:
            defects = cv2.convexityDefects(cnt, hull_indices)
            
            if defects is not None:
                # Count significant defects
                defect_count = 0
                for i in range(defects.shape[0]):
                    s, e, f, d = defects[i, 0]
                    # Adaptive depth threshold based on contour size
                    depth_threshold = max(1000, int(area * 0.01))
                    if d > depth_threshold:
                        defect_count += 1
                
                # Estimate finger count from defects
                finger_count = min(defect_count + 1, 5)  # Cap at 5 fingers
                print(f"Convexity defects method: {defect_count} defects, estimated {finger_count} fingers")
            
    except Exception as e:
        print(f"Convexity defects failed: {e}")
    
    # Method 2: Alternative classification based on shape properties
    if finger_count == 0:  # Fallback method
        print("Using fallback shape analysis method")
        
        # Classify based on shape characteristics
        if solidity > 0.8 and aspect_ratio > 0.7:
            # Compact, square-ish shape = closed fist
            finger_count = 5
            print("Detected closed fist based on high solidity and square aspect ratio")
        elif solidity < 0.6 and extent < 0.6:
            # Lower solidity indicates fingers spread out
            if aspect_ratio > 1.2:
                finger_count = 2  # Likely 2-3 fingers in horizontal orientation
            else:
                finger_count = 1  # Single finger or peace sign
            print(f"Detected spread fingers based on low solidity, estimated {finger_count} fingers")
        elif len(approx) >= 8:
            # Many vertices in approximation might indicate multiple fingers
            finger_count = min(3, max(1, len(approx) // 3))
            print(f"Detected fingers based on contour complexity, estimated {finger_count} fingers")
        else:
            # Default to single finger for simple shapes
            finger_count = 1
            print("Default to single finger detection")

    print(f"Final finger count: {finger_count}")

    # Enhanced gesture mapping with more tolerant ranges
    if finger_count == 1:
        return "open_chat"  # Single finger or point
    elif finger_count == 2 or finger_count == 3:
        return "mark_attendance"  # Peace sign or 3 fingers
    elif finger_count == 4:
        # Special case: 4 fingers could be peace sign detected as 4 due to palm
        # Check aspect ratio to distinguish
        if aspect_ratio < 0.6:  # Tall/narrow shape suggests 2 fingers
            return "mark_attendance"
        else:
            return "teacher_view"
    elif finger_count >= 5:
        return "teacher_view"  # Open hand or fist
    else:
        # Default fallback based on shape characteristics
        if solidity > 0.85:
            return "teacher_view"  # Solid shape like fist
        else:
            return "open_chat"  # Simple shape, default to single gesture

@gesture_api.route('/detect', methods=['POST', 'OPTIONS'])
def detect_gesture():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        image_data = data.get('image')
        if not image_data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode base64 image
        try:
            header, encoded = image_data.split(",", 1)
            img_bytes = base64.b64decode(encoded)
            nparr = np.frombuffer(img_bytes, np.uint8)
            
            if len(nparr) == 0:
                print("Empty image data received")
                return jsonify({'gesture': 'none', 'emoji': '', 'key': None})
            
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                print("Failed to decode image")
                return jsonify({'gesture': 'none', 'emoji': '', 'key': None})
            
        except Exception as e:
            print(f"Image decoding error: {e}")
            return jsonify({'gesture': 'none', 'emoji': '', 'key': None})

        gesture = classify_gesture_opencv(img)

        key = None
        if gesture == "open_chat":
            key = "c"
        elif gesture == "teacher_view":
            key = "t"
        # "mark_attendance" does not trigger a key

        return jsonify({'gesture': gesture, 'emoji': gesture_labels.get(gesture, ""), 'key': key})
    
    except Exception as e:
        print(f"Gesture detection error: {e}")
        return jsonify({'error': 'Internal server error', 'gesture': 'none', 'emoji': '', 'key': None}), 500