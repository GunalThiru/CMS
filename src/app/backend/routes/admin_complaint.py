'''Admin complaint routes'''
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
    """Retrieve and return all complaints in the system."""
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

    # Validate staff member
    staff = User.query.get(staff_id)
    if not staff or staff.role != 'staff':
        return jsonify({'error': 'Invalid staff ID'}), 400

    # Validate complaint existence
    complaint = Complaint.query.get(complaint_id)
    if not complaint:
        return jsonify({'error': 'Complaint not found'}), 404

    # 🔥 Auto-select an admin (temporarily)  
    admin_user = User.query.filter(User.role.in_(["admin", "sub_admin"])).first()
    assigned_by = admin_user.uid if admin_user else 1  # fallback to 1

    # Create assignment entry
    assignment = ComplaintAssignment(
        complaint_id=complaint_id,
        assigned_to=staff_id,
        assigned_by=assigned_by,   # 👈 NEW FIELD
        remarks=remarks
    )

    # Update complaint status
    complaint.status = 'in_progress'

    db.session.add(assignment)
    db.session.commit()

    return jsonify({'message': 'Complaint assigned successfully'})
