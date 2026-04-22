# Smart Dashboard - Documentación Completa del Proyecto

**Última actualización:** 2026-04-22  
**Versión actual:** v19  
**Estado:** Producción (activo)

---

## 📋 RESUMEN EJECUTIVO

**Smart Dashboard** es una aplicación web de **gestión de flota de transporte** diseñada específicamente para personal administrativo sin conocimientos técnicos. Proporciona:

- Control en tiempo real de viajes (rutas Tehuacán-Puebla y Tehuacán-CDMX)
- Análisis de ingresos por unidad (BRUTO, NETO, VOUCHER)
- Filtrado avanzado por fechas, rutas, unidades y conductores
- Gestión de usuarios con roles jerárquicos
- Exportación a PDF con auditoría
- Sesiones seguras con timeout automático
- Diseño responsive (mobile-first a desktop)

---

## 🎨 PALETA DE COLORES & BRANDING

### Colores de Marca (Preservados)
```css
--brand-blue: #2D74B4        /* Azul principal - headers, KPIs, acciones */
--brand-blue-deep: #1E5080   /* Azul oscuro - deep focus */
--brand-green: #6CA636       /* Verde - secundario, indicadores positivos */
--brand-green-deep: #4C7A23  /* Verde oscuro */
--brand-gold: #F2B705        /* Oro/Amarillo - vouchers, acentos */
--accent-orange: #f97316     /* Naranja - alertas, datos especiales */
--accent-red: #ef4444        /* Rojo - negativos, delete */
```

### Lienzo (Blanco Puro - v19)
```css
--bg-primary: #FFFFFF        /* Fondo principal blanco */
--bg-secondary: #FFFFFF      /* Blanco puro */
--bg-card: #FFFFFF           /* Cards blancas */
--bg-subtle: #F8FAFB         /* Azul muy pálido para áreas secundarias */
```

### Bordes y Contraste
```css
--border-glass: #D5DDE5      /* Gris azulado para bordes primarios */
--border-soft: #E5EBF3       /* Azul muy pálido para bordes suaves */
--text-primary: #0F1419      /* Negro oscuro para texto principal */
--text-secondary: #3A4550    /* Gris oscuro para secundario */
--text-muted: #747E8B        /* Gris neutral para texto tenue */
```

### Sidebar (Navy Profundo)
```css
--sidebar-bg: #0E2235        /* Azul marino profundo */
--sidebar-bg-soft: #15304A   /* Azul marino suave */
--sidebar-text: #E8EEF5      /* Texto claro para contraste */
--sidebar-muted: #8AA2BB     /* Gris azulado para texto muted */
```

---

## 🔤 TIPOGRAFÍA

### Fuentes
```
Display (Títulos, KPIs, Números):  'Fraunces' - serif óptico elegante
                                   - font-variation-settings: "opsz" 72/144
                                   - font-weight: 500-600
                                   - font-feature-settings: "tnum", "lnum"

UI (Interfaz, labels, botones):    'Manrope' - sans-serif moderno
                                   - font-feature-settings: "ss01", "cv11"
                                   - font-weight: 400/600/700

Monospace (Datos técnicos):        'JetBrains Mono' - monospace legible
```

### Tamaños Principales
- **KPI Values:** `clamp(1.5rem, 5vw, 2.4rem)` — dinámico y legible
- **Unit Stats:** `1.05rem` — visible en cards
- **Headers (h3):** `1.2rem` — "Fraunces" 500, tracking `-0.01em`
- **Labels:** `0.72rem` uppercase, tracking `0.08em`
- **Tabla:** `0.82rem`, `font-variant-numeric: tabular-nums`

---

## 🏗️ ESTRUCTURA DEL PROYECTO

```
Smart Dashboard/
├── index.html                 # HTML principal (estructura)
├── css/
│   └── styles.css            # Estilos únicos (v19) - REESCRITO COMPLETO
├── js/
│   ├── auth.js               # Autenticación, usuarios, contraseñas
│   ├── data.js               # Carga de Google Sheets, parsing
│   └── app.js                # Lógica principal, filtros, tabla, PDF
├── img/
│   └── logo.png              # Logo de marca
└── PROJECT_DETAILS.md        # Este archivo
```

---

## 🔐 SEGURIDAD & USUARIOS

### Estructura de Roles
```javascript
SuperAdmin (admin)        → Acceso total, auditoría, gestión completa
  │ password: "ivan1.1"
  │ visible: OCULTO (se desbloquea con Easter Egg)
  │
Admin (Ivan)             → Gestión de usuarios, sin auditoría
  │ password: "1"
  │
User (Timoteo)           → Crea hasta 2 sub-usuarios, sin auditoría
  │ password: "arminio"
  │
SubUser (creados por User) → Solo visualización, cambiar propia contraseña
```

### Easter Egg - Desbloqueo Admin
1. Selecciona usuario: **Ivan**
2. Contraseña: **1** ✅
3. Aparece opción "admin" en dropdown
4. Selecciona: **admin**
5. Contraseña: **ivan1.1** ✅
6. SuperAdmin desbloqueado

**Ubicación código:** [app.js:48-63](js/app.js#L48-L63)

### Sesión & Timeout
- **Duración:** 15 minutos (`SESSION_TIME_MS = 15 * 60 * 1000`)
- **Reset:** Se actualiza con mousemove, click, keypress, touchstart
- **Expiración:** Logout automático con mensaje "Sesión expirada por inactividad"
- **Auditoría:** Todo cierre registrado en `auditLog`

**Ubicación código:** [auth.js:14, 38-45, 62-65](auth.js#L14)

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```css
Mobile First (0px):         Sidebar fijo fuera (-100%), overlay
                            Filtros en modal deslizable
                            Tabla con scroll horizontal

Desktop (≥768px):           Sidebar visible siempre
                            Dashboard con margin-left: 280px
                            KPIs 3 columnas
                            Unit summary 2 columnas
```

### Sidebar Filters
- **Ancho:** 280px (`--sidebar-width`)
- **Grids de items:**
  - Rutas: checkboxes en lista
  - **Unidades:** 4 filas (`scroll-x-grid-4`) — scroll horizontal
  - **Conductores:** 2 filas (`scroll-x-grid-2`) — scroll horizontal

---

## 🎯 FUNCIONALIDADES PRINCIPALES

### 1. Login & Autenticación
- **Pantalla:** Fondo gradiente navy, tarjeta blanca elevada
- **Usuarios visibles:** Ivan, Timoteo (admin oculto por defecto)
- **Validación:** Usuario + contraseña
- **Sesión:** Guardada en `currentUser` global
- **Auditoría:** Inicio de sesión registrado

**Archivo:** [index.html:19-40](index.html#L19-L40) + [app.js:32-118](app.js#L32-L118)

### 2. Splash Screen (Carga)
- **Animación:** Van moviéndose (🚐) + progress bar
- **Duración:** 2 segundos
- **Sincronización:** Carga de Google Sheets en paralelo
- **Keyframes:**
  - `drive` — movimiento de van
  - `progress` — relleno de barra

**Archivo:** [index.html:42-50](index.html#L42-L50) + [app.js:78-87](app.js#L78-L87)

### 3. Panel de Filtros (Sidebar)
**Elementos:**
- Rango de fechas (from/to)
- Selector de rutas (4 opciones: Teh-Pue, Pue-Teh, Teh-Mex, Mex-Teh)
- Unidades (scroll grid 4 filas, selección múltiple)
- Conductores (scroll grid 2 filas, "Todos" + individuales)
- Botones: Aplicar Filtros, Limpiar

**Funciones:**
- `getFilteredData()` — lógica de filtrado [app.js:155-179](app.js#L155-L179)
- `initFilters()` — inicializa desplegables [app.js:122-153](app.js#L122-L153)
- Selector de meses con modal [app.js:438-509](app.js#L438-L509)

**Archivo:** [index.html:95-143](index.html#L95-L143)

### 4. KPIs (Key Performance Indicators)
**3 Cards:**
- 💰 **BRUTO** (total ingresos) — Gradiente azul
- 💵 **NETO** (ingresos después de gastos) — Gradiente verde
- 🎫 **VOUCHER** (pagos especiales) — Gradiente oro

**Características:**
- Números grandes con `Fraunces` 600 weight
- Barra de acento lateral de color
- Halo decorativo en esquina que se amplía en hover
- Reveal escalonado al cargar (animation-delay: 40ms, 120ms, 200ms)

**Función:** `renderKPIs()` [app.js:332-341](app.js#L332-L341)

**Archivo:** [index.html:155-174](index.html#L155-L174)

### 5. Análisis por Unidad
**Tarjeta COMBINADA:** Suma total de todos los filtros (viajes, BRUTO, NETO, pasajeros, voucher)

**Cards individuales:** Una por unidad (ordenadas por NETO descendente)
- Número de viajes
- BRUTO / NETO
- Stats en grid 2x2

**Función:** `renderUnitAnalysis()` [app.js:343-385](app.js#L343-L385)

**Archivo:** [index.html:176-182](index.html#L176-L182)

### 6. Tabla de Viajes
**Columnas:** Ruta, Fecha, Conductor, Unidad, Hora, Adultos, Menores, Cuacno, Venta L., Paquetes, Bruto, Neto, Voucher

**Características:**
- Ordenamiento por click en headers
- Búsqueda por palabra/número
- Paginación (50 registros/página)
- Colores: Neto positivo (verde), negativo (rojo)
- Scroll horizontal en móvil

**Funciones:**
- `renderTable()` [app.js:407-436](app.js#L407-L436)
- `getTableData()` [app.js:387-405](app.js#L387-L405)

**Archivo:** [index.html:185-227](index.html#L185-L227)

### 7. Exportación a PDF
**Flujo:**
1. Usuario hace click en "Descargar PDF"
2. Modal de confirmación: "¿Descargar todos los datos filtrados?"
3. Botones: Cancelar | Descargar PDF
4. PDF se genera y descarga
5. Auditoría registra la descarga

**Características:**
- Orientación: Horizontal (landscape)
- Header con título, usuario, fecha
- Tabla con jsPDF.autoTable
- Colores: headers azul, filas alternadas
- Validación: solo si hay filtros aplicados

**Función:** `exportToPDF()` [app.js:511-548](app.js#L511-L548)

**Modal:** [index.html:263-280](index.html#L263-L280)

### 8. Modal de Ajustes (Gestión de Usuarios)
**Pestañas:**
1. **Cambiar Contraseña** (activa por defecto) — para todos los roles
2. **Gestión de Usuarios** — crear/editar usuarios
3. **Registro de Actividad** — solo para SuperAdmin

**Cambio de Contraseña:**
- Botón "Mostrar" arriba del input (pequeño, sin ícono)
- Al presionar: se destaca con fondo azul claro
- Botón alterna texto: "Mostrar" ↔ "Ocultar"

**Gestión de Usuarios:**
- Input: Nombre, Contraseña, Rol
- Rol disponible según user:
  - SuperAdmin: user, admin
  - Admin: user, admin
  - User: subuser (máx 2)
- Botón: "Guardar Usuario"

**Auditoría:**
- Tabla con: Fecha/Hora, Usuario, Password Usado, Acción, Detalles
- Botón rojo: "Limpiar Registro" (solo SuperAdmin)

**Funciones:**
- `openSettingsModal()` [auth.js:75-188](auth.js#L75-L188)
- `switchTab()` [auth.js:179-184](auth.js#L179-L184)
- `changeMyPassword()` [auth.js:239-251](auth.js#L239-L251)
- `addOrUpdateUser()` [auth.js:206-237](auth.js#L206-L237)
- `deleteUser()` [auth.js:178-204](auth.js#L178-L204)

**Archivo:** [index.html:79-90](index.html#L79-L90)

---

## 🎨 COMPONENTES VISUALES

### Header
- **Alto:** 68px
- **Sticky:** fixed top, z-index 100
- **Fondo:** Blanco 90% + backdrop blur
- **Contenido:**
  - Logo + título "Smart Dashboard" (desktop)
  - Botón hamburguesa (móvil)
  - Botón refresh (sincronizar datos)
  - Botón settings (ajustes)
  - Sincronización status (spinner + "Cargando...")

**Archivo:** [index.html:52-77](index.html#L52-L77)

### Botones
```css
.btn-primary              → Gradiente azul, blanco, bold, 13px padding
.btn-icon                 → Fondo #F5F8FC, border azul gris, 40x40
.btn-small / .btn-tiny    → Transparente, border gris, xs/sm texto
.password-toggle          → Azul claro, 3px padding, estado .active
```

### Tarjetas
```css
.kpi-card                 → Blanco, border suave, sombra leve, hover elevado
.unit-summary-card        → Gradiente blanco→azul pálido, border hover
.analysis-section         → Blanco, padding generoso, sombra suave
```

### Entrada de Usuario
```css
.filter-input             → Fondo blanco, border #D5DDE5, focus azul
.password-wrapper         → Flex column, botón arriba (align-self: start)
.search-input             → Fondo #F5F8FC, focus #FFFFFF
```

---

## 📊 DATOS & API

### Fuente: Google Sheets
**Configuración en [data.js:6-22](data.js#L6-L22):**

```javascript
SHEETS_CONFIG.documents = [
  {
    id: "12DKb_WTfxjAay5TDjzbhqLmWoc-ROfK-FubZbW3l5vQ",
    name: "Smart 03 2026",
    month: "2026-03",
    sheets: [
      { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
      { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
      { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
      { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
    ]
  }
  // Agregar nuevos meses aquí
]
```

### Estructura de Datos
```javascript
{
  origen: string,
  destino: string,
  fecha: Date,
  fechaStr: string,
  hora: string,
  unidad: string,
  conductor: string,
  adultos: number,
  menores: number,
  paquetes: number,
  cuacnopalan: number,
  tarifaAdultos: number,
  tarifaMenores: number,
  tarifaPaquetes: number,
  tarifaCuacnopalan: number,
  ventaEnLinea: string,
  voucher: number,
  totalBruto: number,
  totalCasetas: number,
  totalDiesel: number,
  totalNomina: number,
  totalGastos: number,
  totalNeto: number,
  ruta: string,
  tipoRuta: "puebla" | "cdmx",
  totalPasajeros: number,
  semana: number,
  docName: string,
  docMonth: string
}
```

### Parsing
- **`parseDate()`** — DD/MM/YYYY → Date object
- **`parseCurrency()`** — "$1.575" → 1575 (remover $, puntos, negativo)
- **`parseNum()`** — string → integer
- **`parseRowPuebla()`** — 22 columnas Puebla
- **`parseRowCDMX()`** — 24 columnas CDMX
- **`loadAllData()`** — carga todas las hojas en paralelo

---

## ⌨️ EVENTOS & FUNCIONES PRINCIPALES

### Filtros ([app.js:181-323](app.js#L181-L323))
- `setupEvents()` — inicializa todos los listeners
- `getFilteredData()` — filtra por fecha, ruta, unidad, conductor
- Botones: Aplicar, Limpiar, Todos, Ninguno
- Month picker con modal elegante

### Tabla ([app.js:299-436](app.js#L299-L436))
- Click en header → ordena (ASC/DESC toggle)
- Búsqueda en tiempo real (input#table-search)
- Paginación: prev/next 50 registros

### PDF ([app.js:251-276, 511-549](app.js#L251-L549))
- Modal de confirmación Sí/No
- `confirmedExportToPDF()` → ejecuta descarga
- Auditoría de descargas

### Autenticación ([auth.js](auth.js))
- `renderLoginUsers()` — dropdown usuarios
- `openSettingsModal()` — modal ajustes con 3 tabs
- `switchTab()` — cambiar entre tabs
- `togglePasswordVisibility()` — mostrar/ocultar con clase .active
- `changeMyPassword()` — cambiar propia contraseña
- `addOrUpdateUser()` — crear/editar usuarios
- `deleteUser()` — eliminar usuarios
- `clearAudit()` — limpiar auditoría (SuperAdmin)
- `logout()` — cerrar sesión

---

## 🔄 FLUJO DE LA APLICACIÓN

```
1. CARGA INICIAL
   ├─ Pantalla login (usuarios visibles + campo contraseña)
   ├─ Seleccionar usuario → Ivan (contraseña: 1)
   └─ Botón "Entrar"

2. SPLASH SCREEN (2 segundos)
   ├─ Van animada moviéndose
   ├─ Progress bar llenándose
   ├─ Carga datos de Google Sheets en paralelo
   └─ Sincronización status en header

3. DASHBOARD PRINCIPAL
   ├─ Header sticky (logo, refresh, settings)
   ├─ Sidebar filtros (móvil: modal deslizable)
   │  ├─ Rango fechas
   │  ├─ Seleccionar rutas
   │  ├─ Seleccionar unidades (4 filas scroll)
   │  ├─ Seleccionar conductores (2 filas scroll)
   │  └─ Botón "Aplicar Filtros"
   │
   ├─ Contenido principal
   │  ├─ KPIs (BRUTO, NETO, VOUCHER)
   │  ├─ Análisis por Unidad (total combinado + individuales)
   │  ├─ Tabla de Viajes (con ordenamiento y búsqueda)
   │  └─ Paginación
   │
   └─ Botones secundarios
      ├─ Botón "Descargar PDF" → Modal sí/no → Descarga
      ├─ Botón ⚙️ Settings → Modal ajustes
      └─ Botón 🔄 Refresh → Recarga datos + refreshes

4. AJUSTES / GESTIÓN DE USUARIOS
   ├─ Pestaña "Cambiar Contraseña" (activa)
   │  ├─ Botón pequeño "Mostrar" arriba
   │  ├─ Input password
   │  └─ Botón "Actualizar Contraseña"
   │
   ├─ Pestaña "Gestión de Usuarios"
   │  ├─ Inputs: Nombre, Contraseña (con botón mostrar), Rol
   │  └─ Botón "Guardar Usuario"
   │
   └─ Pestaña "Registro de Actividad" (solo SuperAdmin)
      └─ Tabla auditoría + botón "Limpiar Registro"

5. CIERRE DE SESIÓN
   ├─ 15 minutos sin actividad → logout automático
   ├─ Click "Cerrar Sesión" → logout manual
   └─ Volver a pantalla login
```

---

## 🎬 ANIMACIONES & TRANSICIONES

### Easing
```css
--ease: cubic-bezier(0.22, 1, 0.36, 1)  /* Spring suave */
--transition: all 220ms var(--ease)      /* Transición estándar */
```

### Keyframes
- **`drive`** (2s linear) — Van moviéndose de izq a der
- **`progress`** (2s ease-in-out) — Progress bar fill
- **`spin`** (1s linear infinite) — Spinner de carga
- **`cardRise`** (700ms var(--ease)) — Cards elevándose
- **`fadeUp`** (500ms var(--ease)) — Fade in hacia arriba

### Microinteracciones
- Botones: `translateY(-1px)` on hover, `translateY(0)` on active
- Cards: sombra se amplía en hover
- KPIs: halo se amplía en hover (opacity: 0.08 → 0.15)
- Tabs: fade in/out 300ms al cambiar

---

## 📁 ARCHIVOS CLAVE & VERSIONES

### index.html (v19)
- **Cambios recientes:**
  - Actualización versión de cache: `?v=19`
  - Agregadas fuentes: Manrope, Fraunces, JetBrains Mono
  - Login con password toggle arriba
  - Filtros: unidades grid-4, conductores grid-2
  - Modal PDF con confirmación
  - Modal de alerta personalizada
  - Month picker modal

### css/styles.css (v19 - REESCRITO)
- **Reescrita completa** — anterior era versión editorial arena
- **Cambios principales:**
  - Paleta blanco puro + bordes azul gris
  - Sidebar navy profundo con halos radiales
  - KPIs con números Fraunces 600 weight
  - Botón password toggle: pequeño, sin ícono, arriba
  - Grid items responsivos (scroll-x-grid-2, 3, 4, 5)
  - Tabla con hover azul pálido
  - Grano visual reducido (0.1 opacidad)

### js/auth.js (v19)
- **Cambios principales:**
  - `openSettingsModal()` reordenada: Cambiar Contraseña primero
  - Tabla de usuarios removida (gestión simplificada)
  - `switchTab()` corregida — usa `.active` class en vez de `.hidden`
  - `togglePasswordVisibility()` agrega/quita `.active` al botón
  - Password toggle: botón pequeño arriba, texto "Mostrar"/"Ocultar"
  - SubUser view simplificada con mismo patrón

### js/app.js (v19)
- **Cambios principales:**
  - Easter egg admin: verificación corregida (Ivan: "1" → admin: "ivan1.1")
  - PDF export: modal de confirmación sí/no (no estado botón)
  - `confirmedExportToPDF()` nueva función global
  - Todos los eventos y funciones de filtros intactos

### js/data.js (sin cambios)
- Estructura y parsing de datos sin cambios
- Compatible con Google Sheets actual
- Ready para agregar nuevos meses en SHEETS_CONFIG

---

## 🚀 CÓMO CONTINUAR MODIFICANDO

### Para agregar funcionalidades:
1. **Nuevos datos/meses:** Actualizar `SHEETS_CONFIG.documents` en [data.js:6-22](data.js#L6-L22)
2. **Cambiar colores:** Variables CSS en [styles.css:6-52](css/styles.css#L6-L52)
3. **Modificar campos tabla:** Actualizar headers [index.html:197-212](index.html#L197-L212) + parsing en [data.js:152-219](data.js#L152-L219)
4. **Agregar usuarios:** Actualizar `DEFAULT_USERS` en [auth.js:4-8](auth.js#L4-L8)

### Para cambios de diseño:
- **Tipografía:** Ver `--font-display`, `--font-sans` en [styles.css:40-42](css/styles.css#L40-L42)
- **Tamaños:** Ajustar `clamp()` en valores font-size
- **Colores:** CSS variables en `--bg-*`, `--border-*`, `--text-*`
- **Espaciado:** Variables `--radius-sm/md/lg`, padding en componentes

### Performance & Debugging:
- **Console logs:** Ver `APP` object en browser console
- **Auditoría:** `localStorage.getItem('smart_audit')` para ver historial
- **Usuarios guardados:** `localStorage.getItem('smart_users')`
- **Sesión actual:** `currentUser` variable global

---

## ✅ CHECKLIST DE CARACTERÍSTICAS IMPLEMENTADAS

- [x] Login con autenticación y Easter Egg admin
- [x] Sesión con timeout 15 minutos
- [x] Sidebar filtros responsive (4 filas unidades, 2 filas conductores)
- [x] KPIs con números grandes y visibles
- [x] Tabla con ordenamiento y búsqueda
- [x] PDF export con modal confirmación
- [x] Gestión de usuarios por roles
- [x] Cambio de contraseña para todos
- [x] Auditoría de acciones
- [x] Diseño blanco puro + branding preservado
- [x] Tipografía Fraunces + Manrope
- [x] Password toggle pequeño arriba (sin ícono)
- [x] Modal elegante para confirmaciones
- [x] Responsive mobile-first
- [x] Animaciones suaves (spring easing)

---

## 📞 SOPORTE & REFERENCIAS

**Archivos principales:**
- HTML: [index.html](index.html)
- Estilos: [css/styles.css](css/styles.css)
- Auth: [js/auth.js](js/auth.js)
- App: [js/app.js](js/app.js)
- Data: [js/data.js](js/data.js)

**Contraseñas de prueba:**
- Ivan (Admin): `1`
- Timoteo (User): `arminio`
- admin (SuperAdmin): `ivan1.1` (desbloquear via Easter Egg)

**Localización Google Sheets:** Ver `SHEETS_CONFIG.documents[0].id` en [data.js:10](data.js#L10)

---

*Generado: 2026-04-22 por Claude AI*
