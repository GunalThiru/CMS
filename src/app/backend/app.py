from flask import Flask, jsonify
from config import DevelopmentConfig
from extensions import db, cors
from routes import register_routes
from routes.customer_complaint import customer_bp
from routes.admin_complaint import admin_bp   # ✅ add this import
from routes.staff_complaint import staff_bp   # ✅ (you’ll create this soon)
from routes.admin_users import admin_users_bp  # ✅ add this import

def create_app():
    """
    Factory function to create and configure the Flask app.
    Keeps things modular and testable.
    """
    app = Flask(__name__)

    # ✅ Load configuration (DB URL, etc.)
    app.config.from_object(DevelopmentConfig)

    # ✅ Initialize extensions
    db.init_app(app)
    cors.init_app(
        app,
        resources={r"/*": {"origins": ["http://localhost:4200", "http://localhost:5173"]}},
        supports_credentials=True
    )

    # ✅ Register all route blueprints
    register_routes(app)
    app.register_blueprint(customer_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(staff_bp)
    app.register_blueprint(admin_users_bp)

    # ✅ Health check route (optional)
    @app.route('/')
    def health():
        return jsonify({"status": "ok", "message": "Flask backend running"}), 200

    # ✅ Global error handler
    @app.errorhandler(500)
    def handle_500_error(e):
        response = jsonify({'message': 'Internal Server Error', 'error': str(e)})
        response.status_code = 500
        return response

    return app


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
