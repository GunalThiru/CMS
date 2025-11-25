from flask import Blueprint, request, jsonify
from extensions import db
from models import Feedback, User

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/feedback', methods=['POST'])
def give_feedback():
    data = request.json

    staff_id = data.get("staff_id")
    customer_id = data.get("customer_id")
    rating = data.get("rating")
    description = data.get("description", "")

    # Validate user IDs
    staff = User.query.get(staff_id)
    customer = User.query.get(customer_id)

    if not staff or staff.role != "staff":
        return jsonify({"error": "Invalid staff ID"}), 400

    if not customer or customer.role != "customer":
        return jsonify({"error": "Invalid customer ID"}), 400

    if not rating or not (1 <= rating <= 5):
        return jsonify({"error": "Rating must be between 1–5"}), 400

    feedback = Feedback(
        staff_id=staff_id,
        customer_id=customer_id,
        rating=rating,
        description=description
    )

    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted successfully"}), 200
@feedback_bp.route('/feedback/staff/<int:staff_id>', methods=['GET'])
def get_feedback_for_staff(staff_id):                                                       
    feedbacks = Feedback.query.filter_by(staff_id=staff_id).all()
    return jsonify([f.to_dict() for f in feedbacks]), 200                   





                                