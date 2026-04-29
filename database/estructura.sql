-- ============================================
-- ARCHIVO: estructura_completa.sql
-- SISTEMA MÉDICO - ESTRUCTURA COMPLETA
-- Incluye TODO lo necesario para el algoritmo
-- Ejecutar PRIMERO
-- ============================================

CREATE DATABASE SistemaMedico;
GO
USE SistemaMedico;
GO

-- ============================================
-- BLOQUE 1: AUTENTICACIÓN Y USUARIOS
-- ============================================

CREATE TABLE roles (
    id_rol      INT          PRIMARY KEY,
    nombre_rol  VARCHAR(50)  NOT NULL,
    nivel       INT          NOT NULL
);
GO

CREATE TABLE usuarios (
    id_usuario  INT          IDENTITY(1,1) PRIMARY KEY,
    id_rol      INT          NOT NULL,
    nombre      VARCHAR(100) NOT NULL,
    usuario     VARCHAR(50)  NOT NULL UNIQUE,
    contrasena  VARCHAR(50)  NOT NULL,
    estado      VARCHAR(10)  NOT NULL DEFAULT 'activo',
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);
GO

CREATE TABLE sesiones (
    id_sesion     INT          IDENTITY(1,1) PRIMARY KEY,
    id_usuario    INT          NOT NULL,
    token         VARCHAR(100) NOT NULL UNIQUE,
    ip_acceso     VARCHAR(50)  NULL,
    fecha_inicio  DATETIME     NOT NULL DEFAULT GETDATE(),
    fecha_expira  DATETIME     NOT NULL,
    activa        BIT          NOT NULL DEFAULT 1,
    CONSTRAINT fk_sesion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
GO

CREATE TABLE permisos (
    id_permiso      INT         IDENTITY(1,1) PRIMARY KEY,
    id_rol          INT         NOT NULL,
    modulo          VARCHAR(50) NOT NULL,
    puede_ver       BIT         NOT NULL DEFAULT 0,
    puede_crear     BIT         NOT NULL DEFAULT 0,
    puede_editar    BIT         NOT NULL DEFAULT 0,
    puede_eliminar  BIT         NOT NULL DEFAULT 0,
    CONSTRAINT fk_permiso_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    CONSTRAINT uq_rol_modulo  UNIQUE (id_rol, modulo)
);
GO

-- ============================================
-- BLOQUE 2: PACIENTES
-- ============================================

CREATE TABLE pacientes (
    id_paciente        INT          IDENTITY(1,1) PRIMARY KEY,
    id_medico_asignado INT          NULL,
    nombre             VARCHAR(100) NOT NULL,
    apellido           VARCHAR(100) NOT NULL,
    fecha_nacimiento   DATE         NOT NULL,
    genero             VARCHAR(15)  NOT NULL,
    telefono           VARCHAR(20)  NULL,
    email              VARCHAR(150) NULL,
    direccion          VARCHAR(255) NULL,
    tipo_sangre        VARCHAR(5)   NULL,
    estado             VARCHAR(15)  NOT NULL DEFAULT 'activo',
    fecha_registro     DATETIME     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_paciente_medico FOREIGN KEY (id_medico_asignado) REFERENCES usuarios(id_usuario)
);
GO

CREATE TABLE paciente_antecedentes (
    id_antecedente INT          IDENTITY(1,1) PRIMARY KEY,
    id_paciente    INT          NOT NULL,
    tipo           VARCHAR(20)  NOT NULL,
    descripcion    VARCHAR(500) NOT NULL,
    fecha_registro DATETIME     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_antecedente_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);
GO

CREATE TABLE paciente_medicamentos_base (
    id          INT          IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT          NOT NULL,
    medicamento VARCHAR(100) NOT NULL,
    dosis       VARCHAR(50)  NULL,
    frecuencia  VARCHAR(50)  NULL,
    motivo      VARCHAR(255) NULL,
    activo      BIT          NOT NULL DEFAULT 1,
    CONSTRAINT fk_medicamento_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);
GO

-- ============================================
-- BLOQUE 3: CATÁLOGO MÉDICO
-- ============================================

CREATE TABLE sintomas_catalogo (
    id_sintoma        INT          IDENTITY(1,1) PRIMARY KEY,
    nombre_sintoma    VARCHAR(100) NOT NULL,
    categoria         VARCHAR(50)  NOT NULL,
    nivel_riesgo_base INT          NOT NULL DEFAULT 1
);
GO

CREATE TABLE cadenas_evolucion (
    id_cadena        INT          IDENTITY(1,1) PRIMARY KEY,
    nombre_cadena    VARCHAR(100) NOT NULL,
    enfermedad_final VARCHAR(100) NOT NULL,
    categoria        VARCHAR(50)  NOT NULL,
    nivel_final      VARCHAR(20)  NOT NULL DEFAULT 'moderado'
);
GO

CREATE TABLE cadena_pasos (
    id_paso    INT IDENTITY(1,1) PRIMARY KEY,
    id_cadena  INT NOT NULL,
    id_sintoma INT NOT NULL,
    orden      INT NOT NULL,
    es_critico BIT NOT NULL DEFAULT 0,
    CONSTRAINT fk_paso_cadena  FOREIGN KEY (id_cadena)  REFERENCES cadenas_evolucion(id_cadena),
    CONSTRAINT fk_paso_sintoma FOREIGN KEY (id_sintoma) REFERENCES sintomas_catalogo(id_sintoma)
);
GO

-- PATRONES DE RIESGO: combinaciones de síntomas que activan alertas
CREATE TABLE patrones_riesgo (
    id_patron          INT          IDENTITY(1,1) PRIMARY KEY,
    nombre_patron      VARCHAR(100) NOT NULL,
    sintomas_ids       VARCHAR(500) NOT NULL,  -- IDs separados por coma: '1,5,12'
    frecuencia_umbral  INT          NOT NULL DEFAULT 3,
    ventana_dias       INT          NOT NULL DEFAULT 90,
    enfermedad_probable VARCHAR(100) NOT NULL,
    nivel_alerta       VARCHAR(15)  NOT NULL DEFAULT 'observacion'
);
GO

-- ============================================
-- BLOQUE 4: CONSULTAS MÉDICAS
-- ============================================

CREATE TABLE consultas (
    id_consulta        INT          IDENTITY(1,1) PRIMARY KEY,
    id_paciente        INT          NOT NULL,
    id_medico          INT          NOT NULL,
    fecha_consulta     DATETIME     NOT NULL DEFAULT GETDATE(),
    motivo             VARCHAR(500) NULL,
    peso_kg            DECIMAL(5,2) NULL,
    talla_cm           DECIMAL(5,2) NULL,
    presion_arterial   VARCHAR(10)  NULL,
    temperatura        DECIMAL(4,1) NULL,
    frecuencia_cardiaca INT         NULL,
    saturacion_oxigeno DECIMAL(4,1) NULL,
    notas              VARCHAR(MAX) NULL,
    estado             VARCHAR(15)  NOT NULL DEFAULT 'en_curso',
    CONSTRAINT fk_consulta_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT fk_consulta_medico   FOREIGN KEY (id_medico)   REFERENCES usuarios(id_usuario)
);
GO

CREATE TABLE consulta_sintomas (
    id            INT          IDENTITY(1,1) PRIMARY KEY,
    id_consulta   INT          NOT NULL,
    id_sintoma    INT          NOT NULL,
    intensidad    VARCHAR(10)  NOT NULL DEFAULT 'leve',
    duracion_dias INT          NULL,
    descripcion   VARCHAR(255) NULL,
    CONSTRAINT fk_cs_consulta FOREIGN KEY (id_consulta) REFERENCES consultas(id_consulta),
    CONSTRAINT fk_cs_sintoma  FOREIGN KEY (id_sintoma)  REFERENCES sintomas_catalogo(id_sintoma)
);
GO

CREATE TABLE diagnosticos (
    id_diagnostico INT          IDENTITY(1,1) PRIMARY KEY,
    id_consulta    INT          NOT NULL,
    descripcion    VARCHAR(500) NOT NULL,
    codigo_cie10   VARCHAR(10)  NULL,
    categoria      VARCHAR(50)  NULL,
    nivel_gravedad INT          NOT NULL DEFAULT 1,
    es_cronico     BIT          NOT NULL DEFAULT 0,
    CONSTRAINT fk_diagnostico_consulta FOREIGN KEY (id_consulta) REFERENCES consultas(id_consulta)
);
GO

CREATE TABLE tratamientos (
    id_tratamiento INT          IDENTITY(1,1) PRIMARY KEY,
    id_consulta    INT          NOT NULL,
    tipo           VARCHAR(20)  NOT NULL DEFAULT 'medicamento',
    descripcion    VARCHAR(255) NULL,
    medicamento    VARCHAR(100) NULL,
    dosis          VARCHAR(50)  NULL,
    duracion_dias  INT          NULL,
    indicaciones   VARCHAR(500) NULL,
    fecha_inicio   DATE         NULL,
    fecha_fin      DATE         NULL,
    CONSTRAINT fk_tratamiento_consulta FOREIGN KEY (id_consulta) REFERENCES consultas(id_consulta)
);
GO

-- ============================================
-- BLOQUE 5: ALGORITMO - ALERTAS Y EVOLUCIONES
-- ============================================

CREATE TABLE alertas (
    id_alerta         INT          IDENTITY(1,1) PRIMARY KEY,
    id_paciente       INT          NOT NULL,
    id_cadena         INT          NULL,
    tipo_alerta       VARCHAR(15)  NOT NULL DEFAULT 'observacion',
    descripcion       VARCHAR(MAX) NULL,
    categoria_riesgo  VARCHAR(50)  NULL,
    progreso_cadena   INT          NULL DEFAULT 0,
    sintoma_siguiente VARCHAR(100) NULL,
    puntaje           INT          NULL DEFAULT 0,
    fecha_generacion  DATETIME     NOT NULL DEFAULT GETDATE(),
    vista_por_medico  BIT          NOT NULL DEFAULT 0,
    resuelta          BIT          NOT NULL DEFAULT 0,
    CONSTRAINT fk_alerta_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT fk_alerta_cadena   FOREIGN KEY (id_cadena)   REFERENCES cadenas_evolucion(id_cadena)
);
GO

-- Registra qué cadenas están activas por paciente y en qué paso van
CREATE TABLE historial_evoluciones (
    id               INT         IDENTITY(1,1) PRIMARY KEY,
    id_paciente      INT         NOT NULL,
    id_cadena        INT         NOT NULL,
    paso_actual      INT         NOT NULL DEFAULT 1,
    fecha_deteccion  DATETIME    NOT NULL DEFAULT GETDATE(),
    fecha_revision   DATETIME    NULL,
    estado           VARCHAR(15) NOT NULL DEFAULT 'activo',
    CONSTRAINT fk_he_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT fk_he_cadena   FOREIGN KEY (id_cadena)   REFERENCES cadenas_evolucion(id_cadena)
);
GO

-- Avisos generados para el médico cuando hay alertas nuevas
CREATE TABLE notificaciones (
    id_notificacion INT          IDENTITY(1,1) PRIMARY KEY,
    id_usuario      INT          NOT NULL,
    id_alerta       INT          NULL,
    titulo          VARCHAR(150) NOT NULL,
    mensaje         VARCHAR(500) NULL,
    leida           BIT          NOT NULL DEFAULT 0,
    fecha_envio     DATETIME     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_noti_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_noti_alerta  FOREIGN KEY (id_alerta)  REFERENCES alertas(id_alerta)
);
GO

-- ============================================
-- BLOQUE 6: DOCUMENTOS
-- ============================================

CREATE TABLE documentos_consulta (
    id_documento     INT          IDENTITY(1,1) PRIMARY KEY,
    id_consulta      INT          NOT NULL,
    id_paciente      INT          NOT NULL,
    id_medico        INT          NOT NULL,
    numero_documento VARCHAR(30)  NULL,
    tipo_documento   VARCHAR(20)  NOT NULL DEFAULT 'consulta',
    ruta_pdf         VARCHAR(255) NULL,
    estado           VARCHAR(15)  NOT NULL DEFAULT 'generado',
    impresiones      INT          NOT NULL DEFAULT 0,
    fecha_generacion DATETIME     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_doc_consulta FOREIGN KEY (id_consulta) REFERENCES consultas(id_consulta),
    CONSTRAINT fk_doc_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT fk_doc_medico   FOREIGN KEY (id_medico)   REFERENCES usuarios(id_usuario)
);
GO

-- ============================================
-- BLOQUE 7: BACKUP Y AUDITORÍA
-- ============================================

CREATE TABLE backup_diario (
    id_backup       INT           IDENTITY(1,1) PRIMARY KEY,
    nombre_archivo  VARCHAR(100)  NULL,
    fecha_backup    DATE          NULL,
    hora_backup     TIME          NULL,
    tipo            VARCHAR(30)   NOT NULL DEFAULT 'automatico_diario',
    tamanio_mb      DECIMAL(8,2)  NULL,
    total_pacientes INT           NULL,
    total_consultas INT           NULL,
    estado          VARCHAR(15)   NOT NULL DEFAULT 'completado',
    ruta_archivo    VARCHAR(255)  NULL,
    fecha_expira    DATE          NULL
);
GO

CREATE TABLE configuracion_backup (
    id_config        INT         IDENTITY(1,1) PRIMARY KEY,
    hora_ejecucion   VARCHAR(5)  NOT NULL DEFAULT '23:59',
    dias_retencion   INT         NOT NULL DEFAULT 30,
    ruta_destino     VARCHAR(255) NOT NULL DEFAULT 'backups\',
    backup_activo    BIT         NOT NULL DEFAULT 1,
    fecha_modificacion DATETIME  NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE configuracion_sistema (
    id_config   INT          IDENTITY(1,1) PRIMARY KEY,
    clave       VARCHAR(50)  NOT NULL UNIQUE,
    valor       VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL
);
GO

CREATE TABLE auditoria (
    id_auditoria INT          IDENTITY(1,1) PRIMARY KEY,
    id_usuario   INT          NULL,
    accion       VARCHAR(20)  NOT NULL,
    modulo       VARCHAR(50)  NULL,
    descripcion  VARCHAR(500) NULL,
    ip_origen    VARCHAR(50)  NULL,
    fecha_accion DATETIME     NOT NULL DEFAULT GETDATE()
);
GO

-- Copia de cada cambio en el historial médico
CREATE TABLE historial_backup (
    id_backup        INT          IDENTITY(1,1) PRIMARY KEY,
    id_paciente      INT          NULL,
    tipo_evento      VARCHAR(50)  NULL,
    tabla_afectada   VARCHAR(50)  NULL,
    id_registro      INT          NULL,
    datos_anteriores VARCHAR(MAX) NULL,
    datos_nuevos     VARCHAR(MAX) NULL,
    accion           VARCHAR(10)  NULL,
    realizado_por    INT          NULL,
    fecha_backup     DATETIME     NOT NULL DEFAULT GETDATE()
);
GO

-- Registro de datos eliminados (recuperables)
CREATE TABLE log_eliminaciones (
    id_log            INT          IDENTITY(1,1) PRIMARY KEY,
    id_paciente       INT          NULL,
    tabla_origen      VARCHAR(50)  NULL,
    id_registro       INT          NULL,
    datos_eliminados  VARCHAR(MAX) NULL,
    motivo_eliminacion VARCHAR(255) NULL,
    eliminado_por     INT          NULL,
    fecha_eliminacion DATETIME     NOT NULL DEFAULT GETDATE(),
    recuperable       BIT          NOT NULL DEFAULT 1
);
GO