# Sistema de Gestión de Clínica General (Medic-ON)

Plataforma académica para la gestión clínica con:

- **Frontend web** en HTML/CSS/JavaScript (módulos de administración clínica).
- **Backend API** en FastAPI para generación de alertas clínicas.
- **Base de datos** SQL Server con esquema médico completo.

## Estructura del proyecto

```text
.
├── MedicON/                  # Frontend web
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── app.js
│       ├── data.js
│       ├── modules.js
│       └── ui.js
├── backend/                  # API de alertas clínicas (FastAPI)
│   ├── app/
│   │   ├── api/alerts.py
│   │   ├── core/config.py
│   │   ├── db/session.py
│   │   ├── models/clinical.py
│   │   ├── repositories/consultas_repository.py
│   │   ├── schemas/alerts.py
│   │   ├── services/trend_detection_service.py
│   │   └── main.py
│   └── requirements.txt
├── database/
│   ├── estructura.sql        # Estructura principal de base de datos
│   └── datos.sql             # Datos de ejemplo/semilla
└── README.md
```

## Frontend (MedicON)

### Funcionalidad principal

- Dashboard clínico.
- Gestión de citas, pacientes y médicos.
- Módulos administrativos por rol.
- Bitácora de acciones y validaciones de flujo en cliente.

### Ejecución rápida

Desde la raíz del repositorio:

```bash
cd MedicON
python -m http.server 5500
```

Abrir en navegador: `http://localhost:5500`

También puedes usar Live Server o cualquier servidor estático.

### Cuentas demo

| Usuario   | Contraseña | Rol            |
|-----------|------------|----------------|
| admin     | admin123   | ADMINISTRACION |
| dr_garcia | med123     | MÉDICO         |
| recep01   | rec123     | RECEPCIÓN      |
| dr_luna   | med456     | MÉDICO         |

## Backend (FastAPI)

### Requisitos

- Python 3.10+
- SQL Server accesible
- Driver ODBC 18 para SQL Server (según cadena por defecto)

### Instalación

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Variables de entorno

El backend usa configuración por `pydantic-settings` y lee `.env` si existe.

Variables clave:

- `APP_NAME` (default: `SistemaMedico API`)
- `ENV` (default: `production`)
- `DATABASE_URL` (opcional; si no se define, se intenta autodetección local de SQL Server)
- `DB_AUTO_DISCOVERY_ENABLED` (default: `true`)
- `DB_AUTO_HOSTS` (default: `localhost,127.0.0.1,.\SQLEXPRESS`)
- `DB_AUTO_DATABASES` (default: `SistemaMedico`)
- `DB_AUTO_TRY_TRUSTED` (default: `true`)
- `DB_AUTO_USERNAMES` (default: `sa`)
- `DB_AUTO_PASSWORDS` (default: `YourStrong!Passw0rd`)
- `ALERT_WINDOW_DAYS` (default: `30`)
- `ALERT_VISIT_THRESHOLD` (default: `3`)

Ejemplo de `.env`:

```env
APP_NAME=SistemaMedico API
ENV=development
# Opción A (recomendada): dejar sin DATABASE_URL para autodetección local
DB_AUTO_DISCOVERY_ENABLED=true
DB_AUTO_HOSTS=localhost,127.0.0.1,.\SQLEXPRESS
DB_AUTO_DATABASES=SistemaMedico
DB_AUTO_TRY_TRUSTED=true
DB_AUTO_USERNAMES=sa
DB_AUTO_PASSWORDS=YourStrong!Passw0rd

# Opción B: URL fija
# DATABASE_URL=mssql+pyodbc://sa:YourStrong!Passw0rd@localhost/SistemaMedico?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes

ALERT_WINDOW_DAYS=30
ALERT_VISIT_THRESHOLD=3
```

### Ejecutar API

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Endpoints principales

- `GET /health` → estado de servicio.
- `POST /api/v1/alertas/evolucion-patologica` → alerta por hiper-frecuentación.
- `GET /api/v1/alertas/predictiva/{paciente_id}` → alertas predictivas por paciente.

## Base de datos

1. Ejecutar `database/estructura.sql` para crear base y tablas.
2. Ejecutar `database/datos.sql` para datos iniciales.

> Nota: los scripts están orientados a **Microsoft SQL Server**.

## Flujo recomendado de uso

1. Inicializar la base de datos.
2. Levantar backend FastAPI.
3. Levantar frontend estático en `MedicON/`.
4. Conectar frontend con API (si se desea persistencia real, reemplazando mocks de `data.js`).

## Stack tecnológico

- Frontend: HTML5, CSS3, JavaScript Vanilla.
- Backend: FastAPI, SQLAlchemy, Pydantic Settings, Uvicorn.
- Base de datos: SQL Server.

## Equipo

- Jovany Aragon
- David Brughera
- Luka Torres
- Supervisora: Dra. Martha Elena Pulido
- Instituto Tecnológico de Tijuana
