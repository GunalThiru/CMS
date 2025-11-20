from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from datetime import datetime, timezone

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# -------------------------
# Signup Route
# -------------------------
@auth_bp.route('/signup', methods=['POST'])
def signup():

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
        age=data.get('age', 23),
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        password=password,
        role=data.get('role', 'customer'),

        # new fields
        is_online=False,
        last_seen=datetime.now(timezone.utc)
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201


# -------------------------
# Login Route
# -------------------------
@auth_bp.route('/login', methods=['POST'])
def login():

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.password == password:

        # mark user online
        user.is_online = True
        user.last_seen = datetime.now(timezone.utc)
        db.session.commit()

        return jsonify({
            'message': 'Login successful!',
            'user': {
                'id': user.uid,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'dob': user.dob,
                'age': user.age,
                'role': user.role,
                'is_online': user.is_online,
                'last_seen': user.last_seen.isoformat()
            }
        }), 200

    return jsonify({'message': 'Invalid credentials'}), 401


# -------------------------
# Logout Route
# -------------------------
@auth_bp.route('/logout', methods=['POST'])
def logout():

    data = request.get_json()
    user_id = data.get("user_id")

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.is_online = False
    user.last_seen = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify({"message": "Logged out successfully"}), 200
