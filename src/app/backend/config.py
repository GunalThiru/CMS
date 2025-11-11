import os

# -------------------------
# Base configuration
# -------------------------
class Config:
    """
    Base configuration class.
    Contains settings common to all environments.
    """
    # Disable SQLAlchemy event system to save resources
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Secret key for sessions, can be overridden via environment variable
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mysecretkey')


# -------------------------
# Development configuration
# -------------------------
class DevelopmentConfig(Config):
    """
    Configuration for local development.
    Inherits from Config base class.
    """
    # Database connection string to local MySQL
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/cms'

    # Enable debug mode for development
    DEBUG = True



    # Summary of comments:

# Config holds shared settings.

# DevelopmentConfig is for local development with MySQL and debug enabled.

# SECRET_KEY is used for sessions and security.

# SQLALCHEMY_TRACK_MODIFICATIONS=False improves performance.
