# Imagen de producción de EcoCampus (la usa Railway).
# Un solo servicio: Flask atiende /api/* y también sirve el build de Vue,
# así frontend y backend comparten dominio y no hace falta CORS.
#
# Probar en local:
#   docker build -t ecocampus .
#   docker run --rm -p 8000:8000 -e PORT=8000 ecocampus

# ---------- 1) Build del frontend (Vue + Vite) ----------
FROM node:24-slim AS frontend
WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
# Railway pasa las variables del servicio como build args cuando se declaran con ARG.
# VITE_USE_MOCKS=true → el frontend usa los datos de src/mocks en lugar del backend.
ARG VITE_USE_MOCKS=false
RUN npm run build

# ---------- 2) Backend (Flask + Gunicorn) ----------
FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=run.py \
    FRONTEND_DIST=/app/frontend_dist
WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend /frontend/dist ./frontend_dist

# Aplica migraciones (si ya existe la carpeta migrations/) y arranca Gunicorn en el puerto de Railway.
CMD ["sh", "-c", "if [ -d migrations ]; then flask db upgrade; fi && exec gunicorn --bind 0.0.0.0:${PORT:-8000} --workers ${WEB_CONCURRENCY:-2} --access-logfile - run:app"]
