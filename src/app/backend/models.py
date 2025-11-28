"""Database models for the CMS application."""

from datetime import datetime, timezone
from extensions import db


# -------------------------
# User model
# -------------------------
class User(db.Model):

    """Model representing a user in the system."""
    __tablename__ = 'user'

    uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String(20), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='customer')
    is_online = db.Column(db.Boolean, default=False)
    last_seen = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationships
    complaints = db.relationship('Complaint', backref='user', lazy=True)
    assignments = db.relationship(
        'ComplaintAssignment',
        backref='staff_member',
        lazy=True,
        foreign_keys='ComplaintAssignment.assigned_to'  # 👈 tell SQLAlchemy which FK to use
    )


# -------------------------
# Complaint model
# -------------------------

class Complaint(db.Model):
    __tablename__ = 'complaints'
    """Model representing a customer complaint."""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='open')  # open, in_progress, resolved, closed
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    close_date = db.Column(db.DateTime, nullable=True)  # new: when complaint was closed

    assignments = db.relationship('ComplaintAssignment', backref='complaints', lazy=True)

    def to_dict(self):
    # Get the latest assignment for this complaint
        latest_assignment = None
        if self.assignments:
            latest_assignment = sorted(
            self.assignments, key=lambda x: x.updated_at, reverse=True
        )[0]

        return {
        'id': self.id,
        'user_id': self.user_id,
        'title': self.title,
        'description': self.description,
        'status': self.status,
        'created_at': self.created_at.isoformat() if self.created_at else None,
        'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        'close_date': self.close_date.isoformat() if self.close_date else None,

        # added fields
        'assigned_staff_id': latest_assignment.assigned_to if latest_assignment else None,
        'remarks': latest_assignment.remarks if latest_assignment else None
    }

    
# -------------------------
# Complaint Assignment model
# -------------------------
class ComplaintAssignment(db.Model):

    """Model representing the assignment of a complaint to a staff member."""
    __tablename__ = 'complaint_assignment'
    

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey('complaints.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    assigned_by = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    remarks = db.Column(db.String(500))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    def to_dict(self):
        
        return {
            'id': self.id,
            'complaint_id': self.complaint_id,
            'assigned_to': self.assigned_to,
            'assigned_by': self.assigned_by,
            'remarks': self.remarks,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
# -------------------------
# Feedback model    

class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey('complaints.id'), unique=True,nullable=False)  # new
    staff_id = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    staff = db.relationship("User", foreign_keys=[staff_id])
    customer = db.relationship("User", foreign_keys=[customer_id])
    complaint = db.relationship("Complaint", foreign_keys=[complaint_id])  # optional

    def to_dict(self):
        return {
            "id": self.id,
            "complaint_id": self.complaint_id,
            "staff_id": self.staff_id,
            "customer_id": self.customer_id,
            "rating": self.rating,
            "description": self.description,
            "created_at": self.created_at,
        }

