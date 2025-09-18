from flask import Blueprint, request, jsonify
from app.models.attendance import mark_attendance, get_stats, manual_attendance_by_code

attendance_api = Blueprint('attendance_api', __name__)

@attendance_api.route('/attendance/mark', methods=['POST'])
def mark_attendance_endpoint():
    data = request.get_json(force=True)
    roll_number = data.get('roll_number')
    manual = data.get('manual', False)
    if not roll_number:
        return jsonify({"error": "Missing roll_number"}), 400
    success = mark_attendance(roll_number, manual=manual)
    if success:
        return jsonify({"message": "Attendance marked successfully"})
    else:
        return jsonify({"error": "Student not found"}), 404

@attendance_api.route('/attendance/stats/<roll_number>', methods=['GET'])
def get_stats_endpoint(roll_number):
    stats = get_stats(roll_number)
    if stats:
        return jsonify(stats)
    else:
        return jsonify({"error": "Student not found"}), 404

@attendance_api.route('/attendance/manual', methods=['POST'])
def manual_attendance_endpoint():
    data = request.get_json(force=True)
    roll_number = data.get('roll_number')
    code = data.get('code')
    if not roll_number or not code:
        return jsonify({"error": "Missing roll_number or code"}), 400
    success = manual_attendance_by_code(roll_number, code)
    if success:
        return jsonify({"message": "Manual attendance marked"})
    else:
        return jsonify({"error": "Invalid code or student not found"}), 400