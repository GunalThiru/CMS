from flask import Blueprint, request, jsonify
from models import db, Feedback, ComplaintAssignment

feedback_bp = Blueprint('feedback', __name__, url_prefix='/feedback')

@feedback_bp.route('', methods=['POST'])
def submit_feedback():
    data = request.json
    complaint_id = data.get('complaint_id')
    staff_id = data.get('staff_id')
    customer_id = data.get('customer_id')
    rating = data.get('rating')
    description = data.get('description', '')

    if not all([complaint_id, staff_id, customer_id, rating]):
        return jsonify({"error": "complaint_id, staff_id, customer_id, and rating are required"}), 400

    # Check if staff is assigned to complaint
    assignment = ComplaintAssignment.query.filter_by(complaint_id=complaint_id, assigned_to=staff_id).first()
    if not assignment:
        return jsonify({"error": "Staff is not assigned to this complaint"}), 400

    if not (1 <= rating <= 5):
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    feedback = Feedback(
        complaint_id=complaint_id,
        staff_id=staff_id,
        customer_id=customer_id,
        rating=rating,
        description=description
    )
    db.session.add(feedback)
    db.session.commit()

    return jsonify({
        "message": "Feedback submitted successfully",
        "feedback": feedback.to_dict()
    }), 200
