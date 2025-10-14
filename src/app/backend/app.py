from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])  # allow requests from Angular frontend

# ------------------ MySQL Connection ------------------
db = mysql.connector.connect(
    host="localhost",
    user="root",        # your MySQL username
    password="",        # your MySQL password
    database="cms"  # make sure you created this DB
)

cursor = db.cursor(dictionary=True)

# ------------------ Signup Route ------------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data['name']
    email = data['email']
    password = data['password']

    # hash password for security
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, hashed.decode('utf-8'))
        )
        db.commit()
        print("User inserted!")  # Debug print
        return jsonify({'message': 'User created successfully ✅'}), 201
    except mysql.connector.IntegrityError as e:
        print("IntegrityError:", e)  # Debug print
        return jsonify({'message': 'Email already exists ❌'}), 400

# ------------------ Login Route ------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({'message': 'Invalid email or password ❌'}), 401

    # verify password
    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({
            'message': 'Login successful ✅',
            'user': {'name': user['name'], 'email': user['email']}
        })
    else:
        return jsonify({'message': 'Invalid email or password ❌'}), 401

# ------------------ Run Server ------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
