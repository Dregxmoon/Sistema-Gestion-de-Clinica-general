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
│   │   ├── schemas/clinical.py
│   │   ├── services/trend_detection_service.py
│   │   └── main.py
│   └── requirements.txt
├── database/
│   ├── estructura.sql        # Estructura principal de base de datos
│   └── datos.sql             # Datos de ejemplo/semilla
└── README.md
```

---

## Guía de ejecución completa (inicio rápido y reproducible)

> Esta guía está diseñada para que **cualquier persona** pueda levantar el sistema completo (BD + API + frontend) de extremo a extremo.

### 1) Prerrequisitos

- SQL Server 2019+ (Developer/Express también funciona).
- Python 3.10 o superior.
- Driver **ODBC Driver 18 for SQL Server** instalado en el sistema.
- Git (opcional, para clonar).

### 2) Clonar y ubicarse en la raíz

```bash
git clone <URL_DEL_REPO>
cd Sistema-Gestion-de-Clinica-general
```

### 3) Crear base de datos con scripts del proyecto

1. Abrir SQL Server Management Studio (SSMS) o Azure Data Studio.
2. Ejecutar `database/estructura.sql` completo.
3. Ejecutar `database/datos.sql` completo.

> Importante: `estructura.sql` debe ejecutarse **antes** que `datos.sql`.

### 4) Configurar variables de entorno del backend

Dentro de `backend/`, crear archivo `.env`:

```env
APP_NAME=SistemaMedico API
ENV=development

# Recomendado en local: conexión explícita a SQL Server
DATABASE_URL=mssql+pyodbc://sa:YourStrong!Passw0rd@localhost/SistemaMedico?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes

# Umbrales de alertas
ALERT_WINDOW_DAYS=30
ALERT_VISIT_THRESHOLD=3
```

Si prefieres autodetección de instancia SQL local:

```env
DB_AUTO_DISCOVERY_ENABLED=true
DB_AUTO_HOSTS=localhost,127.0.0.1,.\\SQLEXPRESS
DB_AUTO_DATABASES=SistemaMedico
DB_AUTO_TRY_TRUSTED=true
DB_AUTO_USERNAMES=sa
DB_AUTO_PASSWORDS=YourStrong!Passw0rd
```

### 5) Instalar backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 6) Ejecutar backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Validar salud del servicio:

```bash
curl http://localhost:8000/health
```

Respuesta esperada:

```json
{"status":"ok"}
```

### 7) Probar endpoints clínicos principales

Con backend arriba, ejecutar en otra terminal:

```bash
# 1) Listado de pacientes
curl "http://localhost:8000/api/v1/pacientes?limit=10"

# 2) Catálogo de síntomas por categoría
curl "http://localhost:8000/api/v1/sintomas?categoria=Respiratorio&limit=20"

# 3) Expediente clínico resumido
curl "http://localhost:8000/api/v1/expediente/1?window_days=180"

# 4) Alerta predictiva
curl "http://localhost:8000/api/v1/alertas/predictiva/1"

# 5) Alerta por evolución patológica
curl -X POST "http://localhost:8000/api/v1/alertas/evolucion-patologica" \
  -H "Content-Type: application/json" \
  -d '{
    "paciente_id": 1,
    "threshold_x": 3,
    "window_days_y": 30,
    "related_symptoms": [1,2,3]
  }'
```

### 8) Levantar frontend

Desde la raíz del repositorio:

```bash
cd MedicON
python -m http.server 5500
```

Abrir en navegador:

- `http://localhost:5500`

Cuentas demo del frontend:

| Usuario   | Contraseña | Rol            |
|-----------|------------|----------------|
| admin     | admin123   | ADMINISTRACION |
| dr_garcia | med123     | MÉDICO         |
| recep01   | rec123     | RECEPCIÓN      |
| dr_luna   | med456     | MÉDICO         |

---

## Solución de problemas (checklist rápido)

### Error 503 en endpoints clínicos

- Verificar que SQL Server esté encendido.
- Revisar credenciales y host en `DATABASE_URL`.
- Confirmar que existe la base `SistemaMedico`.
- Asegurar que se ejecutaron los scripts `estructura.sql` y `datos.sql`.
- Confirmar instalación del driver ODBC 18.

### No conecta con `SQLEXPRESS`

- Validar nombre de instancia real en SQL Server Configuration Manager.
- Probar `localhost` o `127.0.0.1`.
- Verificar puerto/firewall si la instancia no usa configuración por defecto.

### Frontend no abre

- Verificar que `python -m http.server 5500` quedó ejecutándose sin error.
- Confirmar URL exacta: `http://localhost:5500`.

---

## Endpoints principales

- `GET /health` → estado de servicio.
- `POST /api/v1/alertas/evolucion-patologica` → alerta por hiper-frecuentación.
- `GET /api/v1/alertas/predictiva/{paciente_id}` → alertas predictivas por paciente.
- `GET /api/v1/pacientes` → listado clínico de pacientes para operación y triaje.
- `GET /api/v1/sintomas?categoria=Respiratorio` → catálogo de síntomas configurable por categoría.
- `GET /api/v1/expediente/{paciente_id}` → expediente clínico resumido con consultas y síntomas.

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


## Integración real con SQL Server

La API ya consume información clínica real de SQL Server (pacientes, consultas, síntomas y patrones de riesgo) usando SQLAlchemy sobre `mssql+pyodbc`.

Cadena recomendada para ambiente local:

```env
DATABASE_URL=mssql+pyodbc://sa:YourStrong!Passw0rd@localhost/SistemaMedico?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
```

Para ambientes corporativos, usa usuario técnico dedicado, TLS válido y segmentación de red.
