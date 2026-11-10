"""Registro de blueprints. Cada módulo de rutas es un Blueprint con prefijo /api/<recurso>."""

from .health import bp as health_bp


def register_blueprints(app):
    app.register_blueprint(health_bp, url_prefix="/api")
    # Ejemplo al agregar un módulo nuevo:
    # from .registros import bp as registros_bp
    # app.register_blueprint(registros_bp, url_prefix="/api/registros")
