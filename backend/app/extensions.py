"""Instancias de extensiones compartidas.

Se crean aquí (sin app) y se inicializan en create_app(), así cualquier
módulo puede hacer `from app.extensions import db` sin imports circulares.
"""

from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
