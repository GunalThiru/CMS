from flask import Flask, jsonify, send_from_directory
from config import DevelopmentConfig
from extensions import db, cors
from routes import register_routes
from routes.customer_complaint import customer_bp
from routes.admin_complaint import admin_bp
from routes.staff_complaint import staff_bp
from routes.admin_users import admin_users_bp

def create_app():
    """
    Factory function to create and configure the Flask app.
    Keeps things modular and testable.
    """
    app = Flask(__name__, static_folder='dist/cms/browser')

    # Load config
    app.config.from_object(DevelopmentConfig)

    # Init extensions
    db.init_app(app)
    cors.init_app(
        app,
        resources={r"/*": {"origins": ["http://localhost:4200", "http://localhost:5173"]}},
        supports_credentials=True
    )

    # Register blueprints (API routes)
    register_routes(app)
    app.register_blueprint(customer_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(staff_bp)
    app.register_blueprint(admin_users_bp)

    # Health check (optional)
    @app.route('/api/health')
    def health():
        return jsonify({"status": "ok", "message": "Flask backend running"}), 200

    # 🟢 CATCH-ALL ROUTE FOR ANGULAR SPA (IMPORTANT!)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_angular(path):
        # If file exists in Angular dist, serve it
        try:
            return send_from_directory(app.static_folder, path)
        except:
            # Otherwise return index.html (SPA fallback)
            return send_from_directory(app.static_folder, 'index.html')

    # Error handler
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
