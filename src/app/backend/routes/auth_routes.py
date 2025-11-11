from flask import Blueprint, request, jsonify
from extensions import db
from models import User

# Create a blueprint for authentication-related routes
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# -------------------------
# Signup Route
# -------------------------
@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Handles user signup.
    Expects JSON with 'name', 'password', 'dob', and optionally 'email', 'phone', 'age', 'role'.
    Adds a new user to the database and returns a success message.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    name = data.get('name')
    password = data.get('password')
    dob = data.get('dob')

    if not name or not password or not dob:
        return jsonify({"error": "Missing fields"}), 400

    new_user = User(
        name=name,
        dob=dob,
        age=data.get('age', 23),       # default age if not provided
        email=data.get('email', ''),   # default empty string if not provided
        phone=data.get('phone', ''),   # default empty string if not provided
        password=password,
        role=data.get('role', 'customer')  # default role is 'customer'
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201


# -------------------------
# Login Route
# -------------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Handles user login.
    Expects JSON with 'email' and 'password'.
    Checks credentials and returns user info on success, or an error on failure.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.password == password:


        # Return user info if login is successful
        return jsonify({
            'message': 'Login successful!',
            'user': {
                'id': user.uid,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'role': user.role
            }
        }), 200

    # Return error if credentials are invalid
    return jsonify({'message': 'Invalid credentials'}), 401



# Summary of comments:

# Blueprint auth_bp groups all auth-related routes.

# signup() creates a new user in the database.

# login() checks credentials and returns user info.

# Default values are provided for optional fields like age, phone, email, and role.