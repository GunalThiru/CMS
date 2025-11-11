from .auth_routes import auth_bp         # Import authentication routes blueprint
from .profile_routes import profile_bp   # Import profile-related routes blueprint

def register_routes(app):
    """
    Function to register all routes and blueprints with the Flask app.
    Keeps the main app modular and organized.
    """

    # Define a simple home route to check if the server is running
    @app.route('/')
    def home():
        return "Flask server is running!"

    # Register the authentication blueprint (signup, login, etc.)
    app.register_blueprint(auth_bp)

    # Register the profile blueprint (view/update user profiles)
    app.register_blueprint(profile_bp)



# Summary of comments:ye

# home() route acts as a quick health check for the server.

# Blueprints organize routes by feature (auth, profile, etc.), making the app modular.

# register_routes(app) centralizes all route registration in one place.