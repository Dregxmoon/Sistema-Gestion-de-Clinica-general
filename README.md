# Sistema-Gestion-de-Clinica-general
Es un siste de gestion y administracion de un a clinica medica 

# Medic-ON — Frontend Sistema de Gestión Médica

## Estructura del proyecto

```
medicon/
├── index.html          ← Punto de entrada principal
├── css/
│   └── styles.css      ← Estilos personalizados + animaciones
└── js/
    ├── data.js         ← Datos mock (JSON simulado) + helpers
    ├── ui.js           ← Componentes reutilizables (modals, tablas, badges...)
    ├── modules.js      ← Renderizadores de cada módulo
    └── app.js          ← Auth, routing, shell del layout
```

## Uso

Abre `index.html` directamente en el navegador, o sirve con:

```bash
# Python
python -m http.server 5500

# Node.js
npx serve .

# VS Code → Live Server (extensión recomendada)
```

Luego accede a `http://localhost:5500`

## Cuentas demo

| Usuario    | Contraseña | Rol            |
|------------|-----------|----------------|
| admin      | admin123  | ADMINISTRACION |
| dr_garcia  | med123    | MÉDICO         |
| recep01    | rec123    | RECEPCIÓN      |
| dr_luna    | med456    | MÉDICO         |

## Módulos incluidos

| Módulo         | Rol requerido                         |
|----------------|---------------------------------------|
| Dashboard      | Todos                                  |
| Citas          | Todos                                  |
| Pacientes      | Todos                                  |
| Médicos        | Admin, Recepción                       |
| Horarios       | Solo Admin                             |
| Usuarios       | Solo Admin                             |
| Sucursales     | Solo Admin                             |
| Especialidades | Solo Admin                             |
| Bitácora       | Solo Admin                             |

## Características técnicas

- **HTML5 + CSS3 + JS Vanilla** — sin frameworks JS externos
- **Tailwind CSS** vía CDN para utilidades
- **Plus Jakarta Sans** — tipografía principal
- **Diseño responsive** con sidebar colapsable
- **Datos en memoria** (mock JSON, se pierden al recargar)
- **Control de doble horario** en citas (validación frontend)
- **Bitácora automática** de acciones del usuario
- **Roles y permisos** — el menú se adapta al rol logueado
- **Animaciones** CSS puras (modales, toasts, página)

## Para conectar backend (Python/Flask o similar)

Reemplaza las funciones en `data.js` por fetch() calls:

```js
// Ejemplo: cargar pacientes desde API
async function loadPacientes() {
  const res = await fetch('/api/pacientes');
  DB.pacientes = await res.json();
}
```

## Equipo

- Jovany Aragon· David Brughera · Luka Torres
- Supervisora: Dra. Martha Elena Pulido
- Instituto Tecnológico de Tijuana
