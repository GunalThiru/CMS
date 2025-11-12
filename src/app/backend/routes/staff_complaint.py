# routes/staff_complaint.py
from flask import Blueprint, jsonify, request
from extensions import db
from models import Complaint, ComplaintAssignment

staff_bp = Blueprint('staff', __name__)

# ----------------------------
# Get all complaints assigned to this staff member
# ----------------------------
@staff_bp.route('/staff/complaints/<int:staff_id>', methods=['GET'])
def get_assigned_complaints(staff_id):
    assignments = ComplaintAssignment.query.filter_by(assigned_to=staff_id).all()
    complaints = [a.complaints.to_dict() | {"remarks": a.remarks} for a in assignments]
    return jsonify(complaints)

# ----------------------------
# Update complaint status or remarks
# ----------------------------
@staff_bp.route('/staff/complaints/<int:complaint_id>', methods=['PUT'])
def update_assigned_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    data = request.json

    # Update remarks in assignment
    assignment = ComplaintAssignment.query.filter_by(complaint_id=complaint_id).first()
    if assignment:
        assignment.remarks = data.get('remarks', assignment.remarks)

    # Update complaint status
    if data.get('status') in ['in_progress', 'resolved']:
        complaint.status = data['status']

    db.session.commit()
    return jsonify({'message': 'Complaint updated successfully'}), 200
