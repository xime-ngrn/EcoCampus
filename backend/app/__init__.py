"""Fábrica de la aplicación Flask"""

import os

from flask import Flask, abort, send_from_directory

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
    register_frontend(app)

    return app


def register_frontend(app):
    """En producción sirve el build de Vue desde Flask (mismo dominio que la API).

    Cualquier ruta que no sea /api ni un archivo del build regresa index.html,
    para que Vue Router resuelva rutas como /panel o /captura al recargar la página.
    """
    dist = app.config.get("FRONTEND_DIST")
    if not dist or not os.path.isfile(os.path.join(dist, "index.html")):
        return

    @app.get("/", defaults={"ruta": ""})
    @app.get("/<path:ruta>")
    def frontend(ruta):
        if ruta == "api" or ruta.startswith("api/"):
            abort(404)
        if ruta and os.path.isfile(os.path.join(dist, ruta)):
            return send_from_directory(dist, ruta)
        return send_from_directory(dist, "index.html")
