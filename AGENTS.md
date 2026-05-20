## 🚀 HANDOFF - Lee esto y ya puedes trabajar

### Qué es este proyecto
Smart Dashboard - Dashboard operativo para control de viajes de transporte (Smart Transports) - HTML + CSS + JS vanilla, sin framework, datos en Google Sheets via CSV público.

### Dónde quedamos
- Archivo: `js/data.js`
- Método/función: `SHEETS_CONFIG`
- Línea aproximada: 7–43
- Qué hace: Configuración centralizada de 3 documentos Google Sheets (Marzo, Abril, Mayo 2026), con 4 hojas cada uno (rutas Teh-Pue, Pue-Teh, Teh-Mex, Mex-Teh)
- Qué falta: No hay sesión anterior registrada — primer arranque del sistema AGENTS.md

### Qué ya funciona (no repetir)
- Login con roles (superadmin / admin / user / subuser) + sesión con timeout 15 min
- Easter Egg: usar Ivan + Ivan1.1 desbloquea el usuario "admin"
- Carga de datos desde Google Sheets via CSV público (fetch async)
- Filtros: fechas, rutas, unidades, conductores + selector de mes con doble-tap
- KPIs: Bruto, Neto, Voucher en tiempo real
- Tarjetas de resumen por unidad + tarjeta TOTAL COMBINADO
- Tabla con ordenamiento por columnas, búsqueda, paginación (50 registros/pág)
- Exportación a PDF (jsPDF + autoTable)
- Registro de auditoría (últimas 500 acciones, solo visible para superadmin)
- Gestión de usuarios desde la UI (crear, editar, eliminar con permisos por rol)
- Cache-busting de assets centralizado: versión `3.1.1 PATCH` en `window.SMART_DASHBOARD_RELEASE`
- Splash screen animado con camioneta 🚐 y barra de progreso (1.5s)
- Sidebar de filtros con swipe-down para cerrar en móvil
- Custom dropdown para selección de usuario en login

### Código a medias (si hay)
No hay código a medias detectado en este primer escaneo.

### Reglas críticas
- NO tocar: `js/auth.js` líneas 4–8 (DEFAULT_USERS) sin entender el sistema de migración/normalización de contraseñas (líneas 16–24)
- NO tocar: `js/data.js` líneas 173–240 (parsers Puebla/CDMX) — el mapeo de columnas es frágil y depende del formato exacto de los Sheets
- SÍ puedes modificar: `css/styles.css`, `js/app.js` (lógica de UI), `index.html` (estructura)
- IMPORTANTE: La versión del sistema se cambia SOLO en `index.html` línea 18 (`window.SMART_DASHBOARD_RELEASE`)

### Siguiente paso concreto
Esperar instrucción del usuario — el proyecto está en estado estable y funcional. Preguntar al usuario qué feature o corrección desea trabajar hoy.

### Meta info
- Última sesión: Antigravity - 2026-05-19

<!-- END HANDOFF -->

---

# SMART DASHBOARD

## Project Overview
- Purpose: Dashboard operativo para control y análisis de viajes de transporte terrestre (rutas Tehuacán ↔ Puebla y Tehuacán ↔ CDMX)
- Target: Uso interno de la empresa Smart Transports — acceso vía navegador, optimizado para móvil y escritorio
- Timeline: Proyecto en producción activa (versión 3.3.0 UPDATE)
- Status: Near completion / Mantenimiento activo

## Tech Stack
- Frontend: HTML5 + CSS3 (Vanilla) + JavaScript ES6+ (sin framework)
- Backend: No existe — los datos vienen directo de Google Sheets
- Database: Google Sheets (3 documentos: Marzo, Abril, Mayo 2026)
- APIs: Google Sheets CSV público (`/gviz/tq?tqx=out:csv`)
- Hosting: Archivos estáticos locales (se abre directo en navegador)
- Fuentes: Google Fonts — Manrope, Fraunces, JetBrains Mono
- Librerías externas: jsPDF 2.5.1 + jspdf-autotable 3.5.28 (CDN)

## Project Structure
```
Smart Dashboard/
├── index.html              ← Entrada principal. Contiene toda la estructura HTML + lógica de versión
├── AI_INSTRUCTIONS.md      ← Sistema de contexto universal para IA
├── AGENTS.md               ← Este archivo (contexto y estado del proyecto)
├── css/
│   └── styles.css          ← CSS único (~55KB). Mobile-first. Variables CSS, animaciones, modales
├── js/
│   ├── auth.js             ← Autenticación, roles, sesión, auditoría, gestión de usuarios (~15KB)
│   ├── data.js             ← Carga y parseo de datos desde Google Sheets (~8.8KB)
│   └── app.js              ← Lógica principal de UI: filtros, KPIs, tabla, PDF, eventos (~28KB)
└── img/
    └── logo.png            ← Logo de Smart Transports (37KB)
```

## Critical Files (NO MODIFICAR sin entender)
- `js/auth.js` líneas 4–24: DEFAULT_USERS y normalización de contraseñas. Cambiar sin cuidado puede romper el login.
- `js/data.js` líneas 173–240: Parsers de filas Puebla (22 col) y CDMX (24 col). El índice de cada columna está hardcodeado según el formato real de los Sheets.
- `js/data.js` líneas 7–43: `SHEETS_CONFIG` — IDs de documentos de Google Sheets. Si cambia el documento, actualizar aquí.
- `index.html` línea 18: `window.SMART_DASHBOARD_RELEASE` — fuente única de la versión del sistema.

## Safe to Modify (OK para cualquier IDE)
- `css/styles.css` — estilos, colores, animaciones, responsive
- `js/app.js` — lógica de filtros, renderizado de tabla, KPIs, eventos, exportación PDF
- `index.html` — estructura HTML, modales, textos visibles
- `img/` — assets visuales

## IDE Routing (qué IDE usar para qué)
- Lógica compleja / arquitectura   → Claude Code / Windsurf
- Bugfix rápido / UI               → Cursor
- Feature nueva / scaffolding      → Antigravity
- Tutorial / aprender              → VS Code

## Current Status

### Features Completed
- ✅ Sistema de login con roles y timeout de sesión (15 min)
- ✅ Easter Egg de desbloqueo de superadmin
- ✅ Splash screen con animación de camioneta
- ✅ Carga asíncrona de datos desde Google Sheets (3 meses: Mar, Abr, May 2026)
- ✅ Filtros por fecha, ruta, unidad y conductor
- ✅ Selector de mes con doble-tap para confirmar
- ✅ KPIs: Bruto, Neto, Voucher
- ✅ Tarjetas de resumen por unidad + total combinado
- ✅ Tabla con ordenamiento, búsqueda en tiempo real y paginación
- ✅ Exportación a PDF con modal de confirmación
- ✅ Registro de auditoría (superadmin)
- ✅ Gestión de usuarios (CRUD con control por rol)
- ✅ Cache-busting centralizado de assets
- ✅ Custom dropdown de selección de usuario en login
- ✅ Sidebar responsivo con swipe-down para cerrar en móvil
- ✅ Indicador de sincronización en header

### Features In Progress
- (ninguna detectada en este escaneo inicial)

### Features Not Started
- ⏹️ Gráficas / visualizaciones (mencionadas como posible mejora)
- ⏹️ Filtro multi-mes (actualmente solo 1 mes a la vez)
- ⏹️ Comparativa entre unidades o entre períodos
- ⏹️ Soporte para agregar nuevos meses/documentos desde la UI

## Known Issues

### Active Bugs
- (ninguno detectado en este escaneo inicial)

### Architectural Decisions
- **Sin backend**: Los datos se leen directamente de Google Sheets públicos via CSV. Simple, sin costos de servidor, pero depende de que los Sheets sean públicos y que el formato de columnas no cambie.
- **Roles hardcodeados en DEFAULT_USERS**: Los 3 usuarios base están en el código. El sistema permite crear más desde la UI, pero los defaults siempre se cargan si `localStorage` está vacío.
- **Cache-busting manual**: La versión se actualiza a mano en `index.html`. No hay build system ni versionado automático.
- **CSS monolítico**: Todo el CSS está en un solo archivo `styles.css` (~55KB). No hay preprocesador ni módulos.

## Session History
(máximo 3 sesiones aquí, el resto va a AGENTS_HISTORY.md con /archive)

### Session 1 - Antigravity - 2026-05-19
- Completed: Escaneo inicial del proyecto y creación de AGENTS.md desde cero
- In Progress: Esperando instrucción del usuario
- Modified: AGENTS.md (creado)
- Bugs: Ninguno detectado
- Important: Primera sesión registrada. Proyecto en estado estable y funcional.
- Next Steps: El usuario indicará qué feature o corrección trabajar
