from app import create_app
from extensions import db
from models import Feedback, ComplaintAssignment

app = create_app()

with app.app_context():
    # Check if feedback already exists for this complaint
    existing_feedback = Feedback.query.filter_by(complaint_id=16).first()

    if existing_feedback:
        print("Feedback already submitted for this complaint:", existing_feedback)
    else:
        # Get staff assignment
        assignment = ComplaintAssignment.query.filter_by(complaint_id=16, assigned_to=4).first()
        if assignment:
            feedback = Feedback(
                complaint_id=assignment.complaint_id,
                staff_id=assignment.assigned_to,
                customer_id=1,   # replace with actual customer id
                rating=5,
                description="Great service!"
            )
            db.session.add(feedback)
            db.session.commit()
            print("Feedback inserted:", feedback)
        else:
            print("No staff assigned to this complaint.")
