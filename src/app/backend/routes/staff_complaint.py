# routes/staff_complaint.py
from flask import Blueprint, jsonify, request
from extensions import db
from models import Complaint, ComplaintAssignment

staff_bp = Blueprint('staff', __name__)

# ✅ Get complaints assigned to a specific staff member (excluding closed complaints)
@staff_bp.route('/staff/complaints/<int:staff_id>', methods=['GET'])
def get_assigned_complaints(staff_id):
    try:
        # Find all assignments for this staff
        assignments = ComplaintAssignment.query.filter_by(assigned_to=staff_id).all()
        complaint_ids = [a.complaint_id for a in assignments]

        # Fetch complaints that match those IDs and are not closed
        complaints = Complaint.query.filter(
            Complaint.id.in_(complaint_ids),
            Complaint.status != 'closed'
        ).all()

        return jsonify([c.to_dict() for c in complaints]), 200

    except Exception as e:
        print(f"Error fetching complaints: {e}")
        return jsonify({"error": "Failed to load complaints"}), 500


# ✅ Update complaint (status or remarks)
@staff_bp.route('/staff/update', methods=['PUT'])
def update_complaint():
    try:
        data = request.get_json()
        complaint_id = data.get('complaint_id')
        remarks = data.get('remarks')
        status = data.get('status')

        complaint = Complaint.query.get(complaint_id)
        if not complaint:
            return jsonify({"error": "Complaint not found"}), 404

        # ❌ Block updates to CLOSED complaints
        if complaint.status == 'closed':
            return jsonify({"error": "Cannot update a closed complaint"}), 403

        # Update status if provided
        if status is not None:
            complaint.status = status

        # Update remarks in the ComplaintAssignment if provided
        if remarks:
            assignment = ComplaintAssignment.query.filter_by(
                complaint_id=complaint_id,
                assigned_to=data.get('staff_id')
            ).first()
            if assignment:
                assignment.remarks = remarks

        db.session.commit()
        return jsonify({"message": "Complaint updated successfully", "complaint": complaint.to_dict()}), 200

    except Exception as e:
        print(f"Error updating complaint: {e}")
        db.session.rollback()
        return jsonify({"error": "Failed to update complaint"}), 500
