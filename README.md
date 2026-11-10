# EcoCampus

Sistema web de gestión ambiental y economía circular para la Escuela Superior de Cómputo (ESCOM) del IPN. Permite registrar, procesar y dar seguimiento al consumo de agua, electricidad y papel y a la generación de residuos. Usa modelos de estimación basados en variables de actividad e indicadores normalizados, calcula la huella de carbono y apoya el cumplimiento de los lineamientos de sustentabilidad del IPN y del PIECC-IPN 2026-2030

> Proyecto de la materia **Ingeniería de Software** de la Escuela Superior de Cómputo del IPN.

### Tabla de contenido
- [Contexto y problema](#contexto-y-problema)
- [Objetivo](#objetivo)
- [Roles del sistema](#roles-del-sistema)
- [División del trabajo por módulos](#división-del-trabajo-por-módulos)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [División del trabajo por módulos](#división-del-trabajo-por-módulos)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)


### Integrantes del Proyecto
| Nombre | Usuario de GitHub | Perfil |
| :--- | :---: | :---: |
| Oscar Moreno Juárez | `oscareyabs` | [Github](https://github.com/oscareyabs) |
| Ximena Moreno Noguerón | `xime-ngrn` | [Github](https://github.com/xime-ngrn) |
| Andrik Páez Gómez | `AndrikPG` | [Github](https://github.com/AndrikPG) |
| Iván Pérez Mendoza | `IvanPerezMend` | [Github](https://github.com/IvanPerezMend) |
| Emiliano Ramírez Blanco | `EmilianoRB07` | [Github](https://github.com/EmilianoRB07) |
| Abel Reyes Castellanos | `AbelHunt3r` | [Github](https://github.com/AbelHunt3r) |

---

## Contexto y problema
El IPN paga la electricidad y el agua de forma centralizada, así que la ESCOM no conoce su consumo propio. Al mismo tiempo, el PIECC-IPN 2026-2030 pide que cada dependencia politécnica reporte sus datos cada trimestre en IPN-SiSustenta contra una línea base 2025.

EcoCampus cubre ese hueco. Estima lo que no se mide con variables de actividad (población escolar, días hábiles, censo de carga de equipos), registra lo que sí se mide (lecturas de medidor, compras de papel, pesaje de residuos) y prepara el reporte trimestral de la escuela con los indicadores del PIECC-IPN.

---

## Objetivo
Desarrollar un sistema web que permita a la ESCOM:

1. Registrar consumos de agua, electricidad y papel, ya sean medidos o estimados con modelos proxy.
2. Registrar residuos por categoría y destino, y calcular el porcentaje valorizado (Meta 1 del PIECC-IPN).
3. Calcular la huella de carbono (kg CO₂e) por fuente, por periodo y en total.
4. Definir metas de reducción y darles seguimiento con un semáforo.
5. Consultar un dashboard con indicadores normalizados por persona y generar reportes trimestrales en PDF.

---

## Roles del sistema
| Rol | Qué hace |
|---|---|
| **Administrador** | Gestiona usuarios, roles, periodos de registro y factores de emisión. Genera reportes y exporta datos. |
| **Capturista** | Registra consumos y residuos, adjunta evidencias y corrige registros. |
| **Directivo** | Consulta el dashboard, compara periodos, define metas y genera reportes. |

---

## División del trabajo por módulos
### 1. Módulo de Seguridad y Control de Accesos + Base de datos
 
**Responsable:** Andrik Yael Páez Gómez
**RF:** RF1, RF3, RF4
 
Autenticación, recuperación de contraseña y administración de usuarios y roles. También se encarga del **diseño y la creación de la base de datos** (modelo relacional, migraciones y datos semilla) que usan los demás módulos.
 
| RF | Nombre | Prioridad | Resumen |
|---|---|---|---|
| RF1 | Iniciar sesión | Alta | Valida correo y contraseña contra una cuenta registrada y activa, y da acceso según el rol. |
| RF3 | Restablecer contraseña | Media | Envía un enlace al correo registrado, permite definir una nueva contraseña e invalida la anterior. |
| RF4 | Gestionar usuarios y roles | Alta | El administrador registra, consulta, modifica y da de baja cuentas, y asigna los roles Administrador, Capturista o Directivo. Evita duplicados. |
 
**Entregables:** base de datos, migraciones iniciales, modelo `Usuario`/`Rol`, middleware de autorización por rol (RNF2), hash con bcrypt (RNF1), endpoints de autenticación.
 
---
 
### 2. Módulo de Control Temporal y Auditoría Operativa
 
**Responsable:** Emiliano Ramírez Blanco
**RF:** RF2, RF5, RF22
 
Ciclo de vida de la sesión, periodos de registro e historial de registros.
 
| RF | Nombre | Prioridad | Resumen |
|---|---|---|---|
| RF2 | Cerrar sesión | Alta | Finaliza la sesión activa, invalida el token y regresa a la pantalla de inicio de sesión. |
| RF5 | Gestionar periodos de registro | Alta | El administrador crea, modifica, abre y cierra periodos (mensual, trimestral o semestral) con población escolar y días hábiles. Valida que las fechas sean coherentes y que los periodos no se traslapen. Solo se captura en periodos abiertos. |
| RF22 | Consultar historial de registros | Media | Tabla de registros filtrable por tipo, periodo y tipo de ingreso (medido o estimado), con el capturista que los hizo. |
 
**Entregables:** modelo `Periodo` (con población y días hábiles, que alimentan las estimaciones y los indicadores normalizados), regla de "periodo abierto" reutilizable por los módulos de captura, revocación de tokens, vista de historial.
 
---
 
### 3. Módulo de Factores de Conversión y Captura Hídrica/Energética
 
**Responsable:** Rodrigo Iván Pérez Mendoza
**RF:** RF6, RF7, RF13
 
Catálogo de factores y parámetros que usan todos los cálculos, captura de agua y electricidad (medida o estimada) y edición de registros.
 
| RF | Nombre | Prioridad | Resumen |
|---|---|---|---|
| RF6 | Gestionar factores de emisión y conversión | Alta | Factores por recurso con valor, unidad, fuente, vigencia e historial. Incluye rangos de validación, potencias de referencia por equipo y parámetros proxy. Precarga el factor del Sistema Eléctrico Nacional: **0.444 tCO₂e/MWh**. |
| RF7 | Registrar consumo de agua | Alta | Lectura directa (lectura final − inicial) o estimación: `m³ = dotación × población × días hábiles / 1000`, con la dotación del IMTA configurada en RF6. |
| RF13 | Editar y eliminar registros | Media | Corrige registros con las mismas reglas de validación y pide confirmación antes de eliminar. Al cambiar un registro se recalculan los indicadores y la huella. |
 
> **Nota:** RF8 (consumo eléctrico) quedó asignado al Módulo 4. Como comparte la lógica de "lectura directa o estimación proxy" con RF7, los responsables de los módulos 3 y 4 deben acordar un componente común para el tipo de ingreso.
 
**Entregables:** modelo `Factor` con historial, servicio para obtener el factor vigente, formulario de captura de agua con cálculo proxy, endpoints de edición y eliminación.
 
---
 
### 4. Módulo de Consumibles y Evidencias Documentales
 
**Responsable:** Ximena Moreno Noguerón
**RF:** RF8, RF9, RF11
 
Captura de electricidad y papel, y carga de evidencias que respaldan cada registro.
 
| RF | Nombre | Prioridad | Resumen |
|---|---|---|---|
| RF8 | Registrar consumo eléctrico | Alta | Lectura directa en kWh o estimación con censo de carga: `kWh = Σ(cantidad × potencia × horas × días) / 1000`. |
| RF9 | Registrar consumo de papel | Alta | Captura en kg o resmas, con fuente (compras, almacén o contador de impresiones). Convierte 1 resma carta de 75 g/m² ≈ 2.26 kg. |
| RF11 | Adjuntar evidencia documental | Media | Archivos PDF, JPG o PNG de hasta 5 MB asociados a un registro: comprobante, memoria de cálculo o bitácora de residuos. |
 
**Entregables:** formulario de censo de carga (inventario de equipos por área), conversión de resmas a kg, servicio de carga y almacenamiento de archivos con validación de formato y tamaño (RNF11).
 
---
 
### 5. Módulo de Economía Circular, Validaciones y Metas
 
**Responsable:** José Abel Reyes Castellanos
**RF:** RF10, RF12, RF17, RF18
 
Registro de residuos con criterios del PIECC-IPN, validación automática de todos los registros y gestión de metas de reducción.
 
| RF | Nombre | Prioridad | Resumen |
|---|---|---|---|
| RF10 | Registrar generación y manejo de residuos | Alta | Categorías: orgánicos, inorgánicos reciclables, inorgánicos no reciclables, manejo especial y peligrosos. Destinos: reutilización, reciclaje, composta o disposición final. Calcula el % de residuos valorizados. |
| RF12 | Validar datos capturados | Alta | Antes de guardar, verifica que la cantidad sea numérica, positiva y esté dentro del rango de RF6, y que no exista otro registro con el mismo recurso, periodo y área. Si falla, muestra el motivo. |
| RF17 | Definir metas de reducción | Alta | El directivo fija un rubro, un área, un % de reducción, un periodo base y un periodo objetivo. El sistema calcula el valor objetivo. |
| RF18 | Dar seguimiento a metas | Media | `Avance = (base − actual) / (base − objetivo) × 100`. Semáforo: verde ≥ 100 %, amarillo 50–99 %, rojo < 50 %. |
 
**Entregables:** modelo `Residuo`, servicio de validación **compartido** que usan RF7, RF8, RF9, RF10 y RF13, modelo `Meta` y cálculo del semáforo.
 
---
 
### 6. Módulo de Analítica, Huella de Carbono y Reportes Ejecutivos
 
**Responsable:** Oscar Moreno Juárez
**RF:** RF14, RF15, RF16, RF19, RF20, RF21
 
Cálculo de la huella de carbono, visualización, comparativos, recomendaciones y salida de información.
 
| RF | Nombre | Prioridad | Resumen |
|---|---|---|---|
| RF14 | Calcular huella de carbono | Alta | Cantidad × factor de emisión vigente, por fuente, por periodo y en total (kg CO₂e). Se recalcula al guardar, modificar o eliminar un registro. |
| RF15 | Visualizar dashboard con indicadores y tendencias | Alta | Totales de agua, electricidad, papel, residuos, % valorizado y huella, con indicadores por persona y gráficas de tendencia que distinguen datos medidos de estimados. |
| RF16 | Comparar entre periodos | Alta | Dos o más periodos o áreas lado a lado, con su variación, en valores absolutos y normalizados por persona y por día hábil. |
| RF19 | Mostrar recomendaciones | Baja | Catálogo de buenas prácticas por rubro; muestra primero las de rubros con metas en rojo o con mayor aumento. |
| RF20 | Generar reporte en PDF | Media | Reporte con indicadores, gráficas, huella y avance de metas. Incluye el reporte trimestral con indicadores del PIECC-IPN. |
| RF21 | Exportar datos a CSV | Baja | El administrador exporta los registros de un periodo a `.csv`. |
 
**Entregables:** servicio de cálculo de huella, endpoints de indicadores agregados, dashboard en Vue con Chart.js (RNF7: carga en ≤ 10 s con 5,000 registros), generadores de PDF y CSV, catálogo de recomendaciones precargado.

---

## Stack tecnológico

| Parte      | Tecnología                                         | Carpeta     | Puerto |
| ---------- | -------------------------------------------------- | ----------- | ------ |
| Frontend   | Vue 3 + Vite, Vue Router, Pinia, Lucide (íconos)   | `frontend/` | 5173   |
| Backend    | Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-Cors | `backend/`  | 5000   |

```
EcoCampus/
├── backend/
│   ├── .venv/              ← entorno virtual
│   ├── app/
│   │   ├── __init__.py     ← create_app(): arma la app y registra todo
│   │   ├── config.py       ← configuración leída de .env
│   │   ├── extensions.py   ← db, migrate, cors
│   │   ├── models/         ← tablas (SQLAlchemy)
│   │   ├── routes/         ← endpoints /api/...
│   │   └── services/       ← lógica de negocio (cálculos, validaciones)
│   ├── tests/              ← pruebas con pytest
│   ├── requirements.txt
│   └── run.py
└── frontend/
```

### Requisitos

- **Node.js** 22.18+ o 24.12+
- **Python** 3.12+
- **Git**
- VS Code con las extensiones recomendadas

---

## Instalación y ejecución local

### Backend (PowerShell)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1        # en Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env              # luego edita .env si hace falta
```

### Frontend

```powershell
cd frontend
npm install
```

## Trabajo día a día

Abre **dos terminales**:

```powershell
# Terminal 1 – backend  → http://localhost:5000/api/health
cd backend
.\.venv\Scripts\Activate.ps1
flask run

# Terminal 2 – frontend → http://localhost:5173
cd frontend
npm run dev
```

## Comandos útiles

| Dónde       | Comando                    | Para qué                                     |
| ----------- | -------------------------- | -------------------------------------------- |
| `frontend/` | `npm run dev`              | Servidor de desarrollo con recarga           |
| `frontend/` | `npm run lint`             | Revisa (y corrige) errores de código         |
| `frontend/` | `npm run format`           | Formatea el código con Prettier              |
| `frontend/` | `npm run build`            | Compila para producción en `dist/`           |
| `backend/`  | `flask run`                | Servidor de desarrollo con recarga           |
| `backend/`  | `pytest`                   | Corre las pruebas                            |
| `backend/`  | `flask db migrate -m "…"`  | Genera migración tras cambiar modelos        |
| `backend/`  | `flask db upgrade`         | Aplica las migraciones a la base de datos    |

> La primera vez que haya modelos, inicializar las migraciones con `flask db init`.

---

## Flujo de trabajo con Git
### Ramas
 
| Rama | Uso |
|---|---|
| `main` | Versión estable y entregable. Solo recibe merges desde `develop`. |
| `develop` | Integración de los módulos. |
| `feature/<modulo>-<rf>-<descripcion>` | Trabajo de cada integrante. Ej.: `feature/seguridad-rf1-login`, `feature/analitica-rf14-huella`. |
| `fix/<descripcion>` | Corrección de errores. |
 
### Reglas
 
1. **Nunca** subas `.env`, `.venv/` ni `node_modules/`.
2. Si instalas una dependencia: en backend anótala en `requirements.txt`; en frontend usa
  `npm install <paquete>` (actualiza `package.json` y `package-lock.json`, ambos se suben).
3.  Antes de subir cambios del frontend corre `npm run lint` y `npm run format`.
4. Contrato API: el backend responde JSON y, en errores, `{ "mensaje": "..." }`. Los contratos
  de cada endpoint están documentados arriba de cada función en `frontend/src/services/`.
5. Nadie hace push directo a `main` ni a `develop`.
6. Cada RF se integra con un **Pull Request** hacia `develop`, revisado por al menos un integrante.
7. Antes de abrir el PR, actualiza tu rama con `develop` y verifica que las pruebas pasen.
8. Los cambios al esquema de la base de datos se coordinan con el Módulo 1 y siempre van acompañados de su migración.

### Convención de commits
 
Usamos [Conventional Commits](https://www.conventionalcommits.org/es/) con el RF entre paréntesis:
 
```
feat(RF7): estimación proxy de consumo de agua
fix(RF12): detección de duplicados por área
docs: actualizar diagrama entidad-relación
test(RF18): casos de semáforo amarillo y rojo
refactor(RF6): servicio de factor vigente
```