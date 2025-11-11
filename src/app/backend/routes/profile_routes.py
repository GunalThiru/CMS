from flask import Blueprint, jsonify, request
from extensions import db
from models import User

# Create a blueprint for profile-related routes
profile_bp = Blueprint('profile', __name__, url_prefix='/profile')

# -------------------------
# Get Profile Route
# -------------------------
@profile_bp.route('/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    """
    Fetches the profile of a user by their ID.
    Returns user info if found, otherwise a 404 error.
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'id': user.uid,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'dob': user.dob,
        'age': user.age,
        'role': user.role
    })


# -------------------------
# Update Profile Route
# -------------------------
@profile_bp.route('/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    """
    Updates the profile of a user by their ID.
    Accepts JSON with optional fields: name, phone, dob, age.
    Returns success message after updating.
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json()
    # Update fields only if provided, otherwise keep existing
    user.name = data.get('name', user.name)
    user.phone = data.get('phone', user.phone)
    user.dob = data.get('dob', user.dob)
    user.age = data.get('age', user.age)

    db.session.commit()
    return jsonify({'message': 'Profile updated successfully!'})



# Summary of comments:

# Blueprint profile_bp groups all profile-related routes.

# get_profile() fetches user info by ID.

# update_profile() updates user info, only modifying provided fields.

# Returns appropriate success or error messages.
