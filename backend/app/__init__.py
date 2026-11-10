"""Fábrica de la aplicación Flask"""

from flask import Flask

from .config import Config
from .extensions import cors, db, migrate


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    # Importa los modelos para que Flask-Migrate los detecte
    from . import models  # noqa: F401

    # Rutas
    from .routes import register_blueprints

    register_blueprints(app)

    return app
