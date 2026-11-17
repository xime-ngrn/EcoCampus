CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(30) UNIQUE NOT NULL,
    descripcion_permisos VARCHAR(150) NOT NULL
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INT NOT NULL REFERENCES rol(id_rol),
    nombre_completo VARCHAR(120) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(60) NOT NULL,
    area_adscripcion VARCHAR(80),
    estado_cuenta VARCHAR(15) NOT NULL DEFAULT 'ACTIVA',
    codigo_verificacion VARCHAR(10),
    fecha_alta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP
);

CREATE TABLE sesion (
    id_sesion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    token_jwt VARCHAR(512) UNIQUE NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    revocada BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE token_recuperacion (
    id_token SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    usado BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE bitacora (
    id_bitacora SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accion VARCHAR(30) NOT NULL,
    entidad VARCHAR(50) NOT NULL,
    id_entidad INT,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    motivo TEXT
);

CREATE TABLE periodo_registro (
    id_periodo SERIAL PRIMARY KEY,
    nombre_periodo VARCHAR(50) UNIQUE NOT NULL,
    tipo_periodo VARCHAR(20) NOT NULL DEFAULT 'MENSUAL',
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(15) NOT NULL DEFAULT 'ABIERTO',
    poblacion_alumnos INT NOT NULL DEFAULT 0,
    poblacion_docentes INT NOT NULL DEFAULT 0,
    poblacion_paae INT NOT NULL DEFAULT 0,
    dias_habiles INT NOT NULL DEFAULT 20,
    CONSTRAINT chk_fechas_periodo CHECK (fecha_inicio < fecha_fin)
);

CREATE TABLE area_edificio (
    id_area SERIAL PRIMARY KEY,
    nombre_area VARCHAR(80) UNIQUE NOT NULL,
    tipo_espacio VARCHAR(40) NOT NULL
);

CREATE TABLE cat_recurso_residuo (
    id_recurso SERIAL PRIMARY KEY,
    nombre VARCHAR(60) UNIQUE NOT NULL,
    categoria_circular VARCHAR(40),
    unidad_medida VARCHAR(15) NOT NULL,
    rango_min NUMERIC(10, 2) NOT NULL DEFAULT 0,
    rango_max NUMERIC(10, 2) NOT NULL
);

CREATE TABLE factor_emision_conversion (
    id_factor SERIAL PRIMARY KEY,
    id_recurso INT NOT NULL REFERENCES cat_recurso_residuo(id_recurso),
    valor_factor NUMERIC(12, 6) NOT NULL,
    unidad_factor VARCHAR(25) NOT NULL,
    alcance VARCHAR(15) NOT NULL,
    fuente_oficial VARCHAR(120) NOT NULL,
    fecha_vigencia DATE NOT NULL,
    vigente_hasta DATE,
    es_vigente BOOLEAN NOT NULL DEFAULT TRUE,
    parametros_proxy TEXT
);

CREATE TABLE registro_ambiental (
    id_registro SERIAL PRIMARY KEY,
    folio VARCHAR(20) UNIQUE,
    id_periodo INT NOT NULL REFERENCES periodo_registro(id_periodo),
    id_recurso INT NOT NULL REFERENCES cat_recurso_residuo(id_recurso),
    id_area INT NOT NULL REFERENCES area_edificio(id_area),
    id_usuario_capturista INT NOT NULL REFERENCES usuario(id_usuario),
    tipo_ingreso VARCHAR(25) NOT NULL,
    cantidad NUMERIC(12, 2) NOT NULL,
    unidad_capturada VARCHAR(15) NOT NULL,
    destino_residuo VARCHAR(40),
    variables_actividad_proxy TEXT,
    estado_registro VARCHAR(20) NOT NULL DEFAULT 'VIGENTE',
    observaciones TEXT,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evidencia_documental (
    id_evidencia SERIAL PRIMARY KEY,
    id_registro INT NOT NULL REFERENCES registro_ambiental(id_registro) ON DELETE CASCADE,
    nombre_archivo VARCHAR(150) NOT NULL,
    formato_archivo VARCHAR(5) NOT NULL,
    tamano_mb NUMERIC(4, 2) NOT NULL,
    ruta_almacenamiento VARCHAR(255) NOT NULL,
    metadatos TEXT,
    fecha_carga TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE huella_carbono (
    id_huella SERIAL PRIMARY KEY,
    id_registro INT UNIQUE NOT NULL REFERENCES registro_ambiental(id_registro) ON DELETE CASCADE,
    id_periodo INT NOT NULL REFERENCES periodo_registro(id_periodo),
    id_factor INT NOT NULL REFERENCES factor_emision_conversion(id_factor),
    emision_kg_co2e NUMERIC(14, 4) NOT NULL,
    fecha_calculo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meta_reduccion (
    id_meta SERIAL PRIMARY KEY,
    id_recurso INT NOT NULL REFERENCES cat_recurso_residuo(id_recurso),
    id_area INT REFERENCES area_edificio(id_area),
    id_periodo_base INT NOT NULL REFERENCES periodo_registro(id_periodo),
    id_periodo_objetivo INT NOT NULL REFERENCES periodo_registro(id_periodo),
    id_usuario_directivo INT NOT NULL REFERENCES usuario(id_usuario),
    porcentaje_reduccion NUMERIC(5, 2) NOT NULL,
    valor_base NUMERIC(12, 2) NOT NULL DEFAULT 0,
    valor_objetivo NUMERIC(12, 2) NOT NULL,
    porcentaje_avance NUMERIC(5, 2) NOT NULL DEFAULT 0,
    color_semaforo VARCHAR(10) NOT NULL DEFAULT 'ROJO',
    estado_meta VARCHAR(15) NOT NULL DEFAULT 'ACTIVA'
);

CREATE TABLE cat_recomendacion (
    id_recomendacion SERIAL PRIMARY KEY,
    id_recurso INT NOT NULL REFERENCES cat_recurso_residuo(id_recurso),
    titulo VARCHAR(100) NOT NULL,
    descripcion_recomendacion TEXT NOT NULL,
    criterio_prioridad VARCHAR(30) NOT NULL
);

-- Índices para optimizar consultas frecuentes (RNF7)
CREATE INDEX idx_usuario_correo ON usuario(correo_electronico);
CREATE INDEX idx_sesion_token ON sesion(token_jwt);
CREATE INDEX idx_registro_periodo_recurso ON registro_ambiental(id_periodo, id_recurso);
CREATE INDEX idx_huella_periodo ON huella_carbono(id_periodo);