# routes/admin_complaint.py
from flask import Blueprint, jsonify, request
from extensions import db
from models import Complaint, ComplaintAssignment, User

admin_bp = Blueprint('admin', __name__)

# ----------------------------
# View all complaints
# ----------------------------
@admin_bp.route('/admin/complaints', methods=['GET'])
def get_all_complaints():
    complaints = Complaint.query.all()
    return jsonify([c.to_dict() for c in complaints])

# ----------------------------
# Assign a complaint to a staff member
# ----------------------------
@admin_bp.route('/admin/assign', methods=['POST'])
def assign_complaint():
    data = request.json
    complaint_id = data.get('complaint_id')
    staff_id = data.get('staff_id')
    remarks = data.get('remarks', '')

    # Validate staff
    staff = User.query.get(staff_id)
    if not staff or staff.role != 'staff':
        return jsonify({'error': 'Invalid staff ID'}), 400

    # Check complaint exists
    complaint = Complaint.query.get(complaint_id)
    if not complaint:
        return jsonify({'error': 'Complaint not found'}), 404

    # Create new assignment
    assignment = ComplaintAssignment(
        complaint_id=complaint_id,
        assigned_to=staff_id,
        remarks=remarks
    )

    # Change complaint status to "in_progress"
    complaint.status = 'in_progress'

    db.session.add(assignment)
    db.session.commit()
    return jsonify({'message': 'Complaint assigned successfully'})


