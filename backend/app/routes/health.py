from flask import Blueprint, jsonify

bp = Blueprint("health", __name__)


@bp.get("/health")
def health():
    """Comprobación rápida de que el backend responde: GET /api/health"""
    return jsonify(status="ok")
