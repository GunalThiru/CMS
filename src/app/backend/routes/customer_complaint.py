# routes/customer_complaint.py
from flask import Blueprint, request, jsonify
from extensions import db
from models import Complaint
from datetime import datetime, timezone

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
    mode = request.args.get('mode', 'active')  # active or history

    query = Complaint.query.filter_by(user_id=user_id)

    if mode == 'active':
        query = query.filter(Complaint.status != 'closed')
    else:
        query = query.filter(Complaint.status == 'closed')

    complaints = query.all()
    return jsonify([c.to_dict() for c in complaints])

@customer_bp.route('/complaints/<int:complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    data = request.json
    
    if complaint.status == 'closed':
        return jsonify({'error': 'Closed complaints cannot be modified'}), 400

    # allow editing open or resolved complaints
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

@customer_bp.route('/complaints/close/<int:complaint_id>', methods=['PUT'])
def close_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)

    if complaint.status != 'resolved':
        return jsonify({'error': 'Only resolved complaints can be closed'}), 400

    complaint.status = 'closed'
    complaint.close_date = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify({'message': 'Complaint closed successfully', 'complaint': complaint.to_dict()}), 200
