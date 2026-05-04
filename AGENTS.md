## 🚀 HANDOFF - Lee esto y ya puedes trabajar

### Qué es este proyecto
Smart Dashboard - Control operativo de viajes para flota de transporte - HTML5 + CSS3 + JS vanilla + Google Sheets

### Dónde quedamos
- Archivo: Proyecto iniciado, estructura completa
- Módulo: Sistema de autenticación, auditoría, filtros y datos
- Línea aproximada: N/A (proyecto funcional desde cero)
- Qué hace: Dashboard que carga datos de Google Sheets, gestiona usuarios, auditología de acciones, filtros por ruta/unidad/conductor/fecha, exporta a PDF
- Qué falta: Validar si hay nuevos requerimientos o bugfixes

### Qué ya funciona (no repetir)
- Login con 3 usuarios (admin, Ivan, Timoteo) + desbloqueo de superadmin
- Carga de datos desde Google Sheets (4 rutas: Teh-Pue, Pue-Teh, Teh-Mex, Mex-Teh)
- Sistema de auditoría completo (loguea todas las acciones)
- Filtros por fecha rango, ruta, unidades, conductores
- Exportación a PDF con jsPDF
- Interfaz mobile-first con sidebar responsive
- Splash screen de carga
- Versionado centralizado (20.3.2)
- Tipografía premium (Manrope + Fraunces + JetBrains Mono)

### Código a medias (si hay)
Ninguno. Proyecto está en estado completo y funcional.

### Reglas críticas
- NO tocar: Google Sheets Config en js/data.js sin validar IDs (producción)
- NO modificar: Passwords en auth.js sin comunicar cambios a usuarios
- SÍ puedes modificar: Rutas, estilos, filtros, funcionalidad de exportación

### Siguiente paso concreto
Esperar instrucción del usuario sobre qué hacer (bugfix, nueva feature, mantenimiento, etc.)

### Meta info
- Última sesión: Antigravity AI - 3 de mayo de 2026
- Primera creación de AGENTS.md

<!-- END HANDOFF -->

---

# Smart Dashboard

## Project Overview
- Purpose: Dashboard operativo para control de viajes Smart Transports (flota de vehículos)
- Target: Usuarios internos (admin, supervisores, operadores) - Web responsive
- Timeline: En desarrollo continuo (versión 20.3.2)
- Status: Funcional y en producción

## Tech Stack
- **Frontend:** HTML5, CSS3 (custom design system con paleta Smart), JavaScript vanilla (sin frameworks)
- **Backend:** Google Sheets (fuente de datos) - CRUD mediante integración
- **Storage:** localStorage (auditoría, usuarios, sesiones)
- **Libraries:** 
  - jsPDF (exportación a PDF)
  - jsPDF AutoTable (tablas en PDF)
  - Google Fonts (Manrope, Fraunces, JetBrains Mono)
- **Hosting:** Antigravity (asumido por ubicación del proyecto)
- **Version:** 20.3.2 (major.minor.patch)

## Project Structure
```
d:\Antigravity\SmartT\Smart Dashboard\
├── AI_INSTRUCTIONS.md              (estas instrucciones)
├── AGENTS.md                        (este archivo)
├── index.html                       (HTML principal, login + dashboard)
├── css/
│   └── styles.css                   (sistema de diseño + componentes)
├── js/
│   ├── app.js                       (lógica principal del dashboard)
│   ├── auth.js                      (gestión de usuarios, sesiones, auditoría)
│   └── data.js                      (parseo y carga desde Google Sheets)
├── img/
│   └── logo.png                     (logo Smart Transports)
└── .git/                            (repositorio versionado)
```

## Critical Files (NO MODIFICAR sin entender)
- **data.js → SHEETS_CONFIG**: Google Sheets IDs en producción. Cambiar aquí bloquea acceso a datos
- **auth.js → DEFAULT_USERS**: Credenciales hardcodeadas. Cambios rompen login para usuarios
- **index.html → version variable**: Centraliza cache-busting. Modificar afecta a todos los assets

## Safe to Modify (OK para cualquier IDE)
- css/styles.css (estilos, paleta, componentes)
- js/app.js (filtros, lógica de UI)
- Carpeta img/ (assets gráficos)
- Rutas/labels en data.js

## IDE Routing (qué IDE usar para qué)
- Lógica compleja / arquitectura → Claude Code / Windsurf
- Bugfix rápido / UI            → Cursor
- Feature nueva / scaffolding   → Antigravity
- Tutorial / aprender           → VS Code

## Current Status

### Features Completed
- ✅ Sistema de login con 3 usuarios base
- ✅ Desbloqueo de superadmin (Easter Egg: Ivan + "Ivan1.1")
- ✅ Carga de datos desde Google Sheets (4 rutas configuradas)
- ✅ Auditoría completa de acciones (fecha, usuario, acción, detalles)
- ✅ Filtros multidimensionales (fecha rango, ruta, unidad, conductor, mes)
- ✅ Exportación a PDF con tablas (jsPDF + AutoTable)
- ✅ UI responsive (mobile-first)
- ✅ Interfaz de login personalizada
- ✅ Splash screen de carga
- ✅ Sistema de sesiones (timeout 15 minutos)
- ✅ Versionado centralizado

### Features In Progress
Ninguno actualmente. Esperar instrucción del usuario.

### Features Not Started
- Integración con backend real (actualmente solo Google Sheets)
- Sistema de permisos granulares por rol
- Notificaciones en tiempo real
- Gráficos/dashboards analíticos
- Sincronización offline

## Known Issues

### Active Bugs
- ⚠️ Password "Ivan1.1" está hardcodeado en código (riesgo de seguridad - revisar en producción)
- ⚠️ localStorage no tiene límite máximo de datos (auditoría puede crecer sin control)

### Architectural Decisions
- **SPA vanilla JavaScript**: Elegida para mantener proyecto ligero sin dependencias de frameworks
- **Google Sheets como DB**: Solución rápida para prototipado, escalabilidad limitada
- **localStorage para auditoría**: Funciona para usuarios únicos, no sincroniza entre pestañas/dispositivos
- **Versionado tipo semver**: major.minor.patch + tipo (patch/hotfix/minor/major)
- **Mobile-first CSS**: Prioridad en experiencia mobile, desktop es mejora progresiva

## Session History

### Session 1 - Antigravity AI - 3 de mayo de 2026
- Completed: Escaneo inicial del proyecto, creación de AGENTS.md
- In Progress: —
- Modified: AGENTS.md (nuevo archivo)
- Bugs: Ninguno detectado en esta sesión
- Important: Proyecto está en estado funcional y listo. Estructura y versionado claramente definidos.
- Next Steps: Esperar instrucción del usuario. Comandos disponibles: /init, /scan, /memory, /new, /status, /help
