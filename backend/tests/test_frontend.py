"""Flask sirve el build de Vue en producción (FRONTEND_DIST)."""

import pytest

from app import create_app
from app.config import TestConfig


@pytest.fixture
def client_con_frontend(tmp_path):
    (tmp_path / "index.html").write_text("<div id='app'></div>")
    (tmp_path / "assets").mkdir()
    (tmp_path / "assets" / "app.js").write_text("console.log('ok')")

    class Cfg(TestConfig):
        FRONTEND_DIST = str(tmp_path)

    return create_app(Cfg).test_client()


def test_raiz_sirve_index(client_con_frontend):
    res = client_con_frontend.get("/")
    assert res.status_code == 200
    assert b"id='app'" in res.data


def test_ruta_de_vue_router_sirve_index(client_con_frontend):
    res = client_con_frontend.get("/captura/electricidad")
    assert res.status_code == 200
    assert b"id='app'" in res.data


def test_sirve_archivos_del_build(client_con_frontend):
    res = client_con_frontend.get("/assets/app.js")
    assert res.status_code == 200
    assert b"console.log" in res.data


def test_api_sigue_respondiendo(client_con_frontend):
    assert client_con_frontend.get("/api/health").get_json() == {"status": "ok"}


def test_api_inexistente_no_regresa_index(client_con_frontend):
    assert client_con_frontend.get("/api/no-existe").status_code == 404


def test_sin_build_no_registra_rutas(client):
    assert client.get("/").status_code == 404
