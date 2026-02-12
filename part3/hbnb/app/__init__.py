from flask import Flask
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from hbnb.app.extensions import bcrypt, jwt

db = SQLAlchemy()


def create_app(config_class="config.DevelopmentConfig"):
    """
    Application factory for creating Flask app instances.
    
    Args:
        config_class: Configuration class to use (default: DevelopmentConfig)
    
    Returns:
        Flask application instance
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS for all routes (allow frontend on port 8000 to access API)
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:8000", "http://127.0.0.1:8000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    api = Api(
        app,
        version="1.0",
        title="HBnB API",
        description="HBnB Application API",
        doc="/api/v1/",
    )

    # Import and register namespaces
    from hbnb.app.api.v1.users import api as users_ns
    from hbnb.app.api.v1.amenities import api as amenities_ns
    from hbnb.app.api.v1.places import api as places_ns
    from hbnb.app.api.v1.reviews import api as reviews_ns

    api.add_namespace(users_ns, path='/api/v1/users')
    api.add_namespace(amenities_ns, path='/api/v1/amenities')
    api.add_namespace(places_ns, path='/api/v1/places')
    api.add_namespace(reviews_ns, path='/api/v1/reviews')

    return app
