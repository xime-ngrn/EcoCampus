"""Configuración leída de variables de entorno (archivo .env)."""

import os

from dotenv import load_dotenv

load_dotenv()


def _database_url():
    url = os.getenv("DATABASE_URL", "sqlite:///ecocampus.db")
    # Railway entrega "postgresql://..." (o "postgres://..."). Se fija el driver psycopg 3
    # para no depender del que SQLAlchemy elija por defecto según su versión.
    for prefijo in ("postgres://", "postgresql://"):
        if url.startswith(prefijo):
            return "postgresql+psycopg://" + url[len(prefijo):]
    return url


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-inseguro-cambiar")
    SQLALCHEMY_DATABASE_URI = _database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Revisa la conexión antes de usarla (PostgreSQL cierra las que quedan inactivas)
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")]

    # Carpeta con el build de Vue (`npm run build`). Solo se define en producción (Dockerfile);
    # en desarrollo queda vacía y el frontend lo sirve Vite.
    FRONTEND_DIST = os.getenv("FRONTEND_DIST")

    # Evidencias (PDF/JPG/PNG) – máximo 5 MB
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
