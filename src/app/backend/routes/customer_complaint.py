# routes/customer_complaint.py
from flask import Blueprint, request, jsonify
from extensions import db
from models import Complaint

customer_bp = Blueprint('customer', __name__)

@customer_bp.route('/complaints', methods=['POST'])
def submit_complaint():
    data = request.json
    complaint = Complaint(
        user_id=data['user_id'],
        title=data['title'],
        description=data['description'],
        status='open'
    )
    db.session.add(complaint)
    db.session.commit()
    return jsonify({'message': 'Complaint submitted successfully', 'complaint': complaint.to_dict()}), 201

@customer_bp.route('/complaints/<int:user_id>', methods=['GET'])
def get_complaints(user_id):
    complaints = Complaint.query.filter_by(user_id=user_id).all()
    return jsonify([c.to_dict() for c in complaints])

@customer_bp.route('/complaints/<int:complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)

    data = request.json
    if complaint.status not in ['open', 'resolved']:
        return jsonify({'error': 'Only open or resolved complaints can be modified'}), 400

    complaint.title = data.get('title', complaint.title)
    complaint.description = data.get('description', complaint.description)
    complaint.status = data.get('status', complaint.status)
    db.session.commit()
    return jsonify({'message': 'Complaint updated successfully', 'complaint': complaint.to_dict()})

@customer_bp.route('/complaints/<int:complaint_id>', methods=['DELETE'])
def delete_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    if complaint.status != 'open':
        return jsonify({'error': 'Only open complaints can be deleted'}), 400

    db.session.delete(complaint)
    db.session.commit()
    return jsonify({'message': 'Complaint deleted successfully'})

# ✅ New: Close a resolved complaint (move to history)
@customer_bp.route('/complaints/close/<int:complaint_id>', methods=['PUT'])
def close_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    if complaint.status != 'resolved':
        return jsonify({'error': 'Only resolved complaints can be closed'}), 400

    complaint.status = 'closed'
    db.session.commit()
    return jsonify({'message': 'Complaint closed successfully', 'complaint': complaint.to_dict()}), 200
