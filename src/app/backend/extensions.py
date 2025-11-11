"""This module initializes Flask extensions like SQLAlchemy and CORS."""
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# -------------------------
# Database extension
# -------------------------
# SQLAlchemy instance to be initialized with the Flask app.
# Provides ORM capabilities to interact with MySQL (or other DBs).
db = SQLAlchemy()

# -------------------------
# CORS extension
# -------------------------
# CORS instance to handle Cross-Origin Resource Sharing.
# This allows your Angular frontend (localhost:4200) to make requests
# to the Flask backend (localhost:5000) without CORS errors.
cors = CORS()
