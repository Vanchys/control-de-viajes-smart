## 🚀 HANDOFF - Lee esto y ya puedes trabajar

### Qué es este proyecto
Smart Dashboard - Control operativo de viajes para flota de transporte - HTML5 + CSS3 + JS vanilla + Google Sheets

### Dónde quedamos
- Archivo: css/styles.css (rediseño visual principal), index.html (ajustes menores)
- Módulo: Rediseño visual completo en 9 fases (UI/UX mejorada, responsividad móvil optimizada)
- Línea aproximada: Fase 1 iniciada (variables de marca)
- Qué hace: Rediseño de interfaz manteniendo lógica intacta. Paleta de marca actualizada (#1B4F8A azul, #4CAF50 verde, #F5A623 oro), KPIs rediseñados, panel filtros mejorado, tabla con colores semánticos, responsividad crítica móvil en panel filtros
- Qué falta: Completar 9 fases de rediseño + validación responsive en móviles reales (320px-390px)

### Qué ya funciona (no repetir)
- Login con 3 usuarios + desbloqueo superadmin (mantener intacto)
- Carga datos desde Google Sheets (mantener intacto)
- Sistema de auditoría (mantener intacto)
- Filtros, exportación PDF, sesiones (mantener intacto)
- plan.md con especificaciones de rediseño completamente documentado

### Código a medias (si hay)
Nada. Rediseño empieza desde cero en css/styles.css respetando estructura funcional.

### Reglas críticas
- NO tocar: js/data.js (Google Sheets IDs), js/auth.js (credenciales, auditoría)
- NO quebrar: IDs HTML usados por eventos (mantener todos los data-id, #username, #month-picker-modal, etc.)
- NO remover: Scripts de jsPDF, Google Fonts, cache-busting de version
- SÍ modificar: css/styles.css (principal del rediseño), estilos inline de HTML por clases CSS

### Siguiente paso concreto
1. Actualizar `:root` en css/styles.css con paleta oficial (Fase 1)
2. Rediseñar botones, login, KPIs (Fases 3-4)
3. Fijar responsividad móvil del panel de filtros (Fase 5 crítica)
4. Completar fases 6-8
5. Validación responsive en múltiples dispositivos

### Meta info
- Última sesión: Usuario (IDE desconocido) - 4 de mayo de 2026
- Cambio: Iniciando Rediseño Visual - v2.1.3

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
- **Version:** 20.4.0 (major.minor.patch) - Rediseño Visual Iniciado

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
- 🎨 Rediseño Visual Completo (9 fases)
  - Fase 1: Variables de marca (#1B4F8A, #4CAF50, #F5A623, etc.)
  - Fase 2: Limpieza visual segura de HTML
  - Fase 3: Rediseño de botones y login
  - Fase 4: KPIs con gradientes de marca
  - Fase 5: Panel filtros mejorado + corrección responsividad móvil (crítica)
  - Fase 6: Tabla con colores semánticos
  - Fase 7: Modales y selector de meses
  - Fase 8: HTML dinámico (usuarios, resumen)
  - Fase 9: Validación visual y técnica en dispositivos reales

### Features Not Started
- Integración con backend real (mantener Google Sheets por ahora)
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

### Session 2 - Usuario - 4 de mayo de 2026
- Completed: Creación de plan.md con 9 fases de rediseño visual, actualización de versión a 20.4.0
- In Progress: Rediseño Visual completo (comenzando Fase 1)
- Modified: AGENTS.md (Handoff + Current Status), version en index.html (20.3.2 → 20.4.0)
- Bugs: Ninguno detectado
- Important: Plan.md contiene especificaciones detalladas. Responsividad móvil es crítica en Fase 5 (panel filtros debe mantener botón visible en 320px-390px).
- Next Steps: Iniciar Fase 1 (Variables de marca en css/styles.css)

### Session 1 - Antigravity AI - 3 de mayo de 2026
- Completed: Escaneo inicial del proyecto, creación de AGENTS.md
- In Progress: —
- Modified: AGENTS.md (nuevo archivo)
- Bugs: Ninguno detectado en esta sesión
- Important: Proyecto está en estado funcional y listo. Estructura y versionado claramente definidos.
- Next Steps: Esperar instrucción del usuario. Comandos disponibles: /init, /scan, /memory, /new, /status, /help
