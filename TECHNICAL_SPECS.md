# Smart Dashboard - Especificaciones Técnicas

## 🔧 Stack Tecnológico

### Frontend
- **HTML5** — Estructura semántica
- **CSS3** — Grid, Flexbox, CSS Variables, Media Queries
- **JavaScript (Vanilla)** — ES6+, sin frameworks
- **Google Fonts** — Manrope, Fraunces, JetBrains Mono

### Backend/Datos
- **Google Sheets API** — Source de datos
- **localStorage** — Persistencia (usuarios, auditoría)
- **jsPDF + jsPDF-AutoTable** — Generación PDF

### Herramientas
- **Git** — Control de versiones
- **VS Code / IDE** — Desarrollo

---

## 📐 Arquitectura

### Modularización
```
index.html
├─ Estructura HTML
├─ Elementos estáticos (login, modales, tabla)
└─ Contenedores dinámicos (dashboard, filtros)

css/styles.css
├─ Variables CSS (:root)
├─ Estilos globales (body, reset)
├─ Componentes (buttons, cards, inputs)
├─ Layout (grid, flexbox, responsive)
└─ Animaciones (keyframes, transiciones)

js/auth.js
├─ Gestión de usuarios (localStorage)
├─ Autenticación (login, logout)
├─ Sesión (timeout 15 min)
├─ Modal ajustes (3 tabs)
├─ Auditoría (actions log)
└─ Contraseñas (toggle visibility)

js/data.js
├─ Configuración Google Sheets
├─ Parsing (CSV → JSON)
├─ Funciones helper (parseDate, parseCurrency, etc)
└─ Funciones de formato (formatMoney, formatDateStr)

js/app.js
├─ Estado global (APP object)
├─ Inicialización (DOMContentLoaded)
├─ Filtros (sidebar logic)
├─ Renderizado (KPIs, tabla, análisis)
├─ Tabla (ordenamiento, búsqueda, paginación)
├─ PDF export (jsPDF generation)
└─ Eventos (listeners en botones)
```

---

## 🗄️ Estado Global (JavaScript)

### APP Object
```javascript
const APP = {
  allData: [],              // Array de todos los registros cargados
  filteredData: [],         // Array filtrado (después de aplicar filtros)
  currentPage: 1,           // Página actual tabla (paginación)
  pageSize: 50,             // Registros por página
  sortCol: "fecha",         // Columna por ordenar
  sortAsc: false,           // Dirección ordenamiento
  searchTerm: ""            // Término búsqueda tabla
};
```

### Globales
```javascript
currentUser = null;         // Usuario sesión actual
users = [];                 // Array usuarios (localStorage)
auditLog = [];              // Array auditoría (localStorage)
sessionTimeout = null;      // ID timeout sesión
```

---

## 📊 Flujo de Datos

### Carga Inicial
```
1. DOMContentLoaded
   ↓
2. renderLoginUsers() — Cargar usuarios de localStorage (o DEFAULT_USERS)
   ↓
3. Usuario selecciona Ivan + contraseña "1" + click Entrar
   ↓
4. Validación + logAction("Inicio de Sesión")
   ↓
5. Splash screen 2 segundos
   ↓
6. loadAllData() — Cargar CSV de Google Sheets
   ↓
7. initFilters() — Populars dropdowns con datos
   ↓
8. renderAll() — Renderizar KPIs, análisis, tabla
```

### Filtrado & Renderizado
```
Usuario click "Aplicar Filtros"
   ↓
getFilteredData() — Aplicar condiciones
   ↓
APP.filteredData = resultado
   ↓
renderAll()
   ├─ renderKPIs() — Calcular sumas
   ├─ renderUnitAnalysis() — Agrupar por unidad
   └─ renderTable() — Mostrar página actual
   ↓
logAction("Filtros Aplicados", ...)
```

### Exportación PDF
```
Usuario click "Descargar PDF"
   ↓
¿Hay filtros aplicados? (validación)
   ↓
Modal: ¿Descargar?
   ├─ Cancelar → cerrar modal
   └─ Descargar → confirmedExportToPDF()
      ↓
      exportToPDF()
      ├─ jsPDF instance
      ├─ Header (título, usuario, fecha)
      ├─ autoTable (datos filtrados)
      └─ doc.save(filename)
      ↓
      logAction("Descarga PDF", ...)
```

---

## 🔐 Seguridad & Sesión

### Autenticación
```javascript
// Login
usuario = users.find(u => u.username === selected)
if (usuario && usuario.password === password) {
  currentUser = { ...usuario, passwordUsed: password }
  logAction("Inicio de Sesión")
  resetSessionTimer()
} else {
  showAlert("Contraseña incorrecta")
}
```

### Timeout Sesión
```javascript
const SESSION_TIME_MS = 15 * 60 * 1000  // 15 minutos

function resetSessionTimer() {
  clearTimeout(sessionTimeout)
  sessionTimeout = setTimeout(() => {
    logout("Sesión expirada por inactividad (15 min)")
  }, SESSION_TIME_MS)
}

// Se ejecuta en: mousemove, click, keypress, touchstart
document.addEventListener("mousemove", resetSessionTimer)
document.addEventListener("click", resetSessionTimer)
document.addEventListener("keypress", resetSessionTimer)
document.addEventListener("touchstart", resetSessionTimer)
```

### Auditoría
```javascript
function logAction(action, details = "") {
  if (!currentUser) return
  
  auditLog.unshift({
    date: new Date().toLocaleString('es-MX'),
    username: currentUser.username,
    passwordUsed: currentUser.passwordUsed,
    action: action,
    details: details
  })
  
  if (auditLog.length > 500) auditLog.pop()
  saveAuditLog()
}

// Guardado en localStorage con key 'smart_audit'
```

---

## 🎯 Key Functions

### auth.js
```javascript
renderLoginUsers()              // Poblar dropdown usuarios
openSettingsModal()             // Abrir modal ajustes
switchTab(tabId, btnElement)    // Cambiar entre tabs
togglePasswordVisibility()      // Mostrar/ocultar contraseña
changeMyPassword()              // Actualizar propia contraseña
addOrUpdateUser()               // Crear/editar usuario
deleteUser(index)               // Eliminar usuario
logout(reason)                  // Cerrar sesión
clearAudit()                    // Limpiar auditoría
```

### data.js
```javascript
loadAllData(onStatus)           // Cargar todas las hojas Google Sheets
fetchSheetCSV(docId, sheetName) // Fetch CSV de una hoja
parseCSV(csvText)               // Parse CSV crudo → array
parseRowPuebla(row, route)      // Parse fila tipo Puebla
parseRowCDMX(row, route)        // Parse fila tipo CDMX
parseCurrency(value)            // "$1.575" → 1575
parseNum(value)                 // "123" → 123
parseDate(value)                // "15/03/2026" → Date object
formatMoney(amount)             // 1575 → "$1,575"
formatDateStr(date)             // Date → "15/03/2026"
```

### app.js
```javascript
initFilters()                   // Inicializar opciones filtros
getFilteredData()               // Aplicar todas las condiciones
setupEvents()                   // Listeners de botones
renderAll()                     // Re-renderizar dashboard
renderKPIs()                    // Actualizar KPIs
renderUnitAnalysis()            // Actualizar cards unidades
renderTable()                   // Renderizar tabla
getTableData()                  // Datos tabla con búsqueda/orden
exportToPDF()                   // Generar y descargar PDF
setupMonthPicker()              // Inicializar month picker modal
```

---

## 🎨 CSS Architecture

### Variables Globales (:root)
```css
/* Colores marca */
--brand-blue: #2D74B4
--brand-green: #6CA636
--brand-gold: #F2B705

/* Lienzo */
--bg-primary: #FFFFFF
--border-glass: #D5DDE5
--text-primary: #0F1419

/* Sidebar */
--sidebar-bg: #0E2235
--sidebar-text: #E8EEF5

/* Tipografía */
--font-sans: 'Manrope', system-ui, sans-serif
--font-display: 'Fraunces', 'Times New Roman', serif
--font-mono: 'JetBrains Mono', ui-monospace, monospace

/* Dimensiones */
--sidebar-width: 284px
--header-height: 68px
--radius-md: 14px

/* Animaciones */
--ease: cubic-bezier(0.22, 1, 0.36, 1)
--transition: all 220ms var(--ease)
```

### Responsive
```css
/* Mobile First */
@media (min-width: 768px) {
  /* Desktop changes */
  #filters-panel { left: 0 }
  #dashboard { margin-left: var(--sidebar-width) }
  #kpis-section { grid-template-columns: repeat(3, 1fr) }
}
```

---

## 📦 Dependencias Externas

### Librerías CDN
```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@500;600&display=swap">

<!-- jsPDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- jsPDF-AutoTable -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
```

---

## 💾 localStorage Keys

### smart_users
```json
[
  { "username": "Ivan", "password": "1", "role": "admin" },
  { "username": "Timoteo", "password": "arminio", "role": "user" }
]
```

### smart_audit
```json
[
  {
    "date": "22/04/2026 14:32:15",
    "username": "Ivan",
    "passwordUsed": "1",
    "action": "Inicio de Sesión",
    "details": "Ingreso exitoso."
  }
]
```

---

## 🔄 Event Flow

### Login
```
form#login-form submit
  → getUser() + password check
  → currentUser = user
  → resetSessionTimer()
  → logAction()
  → show dashboard
```

### Filtros
```
click #btn-apply-filters
  → getFilteredData()
  → APP.filteredData = result
  → renderAll()
  → logAction("Filtros Aplicados")
```

### Modal Ajustes
```
click #btn-settings
  → openSettingsModal()
  → renderizar 3 tabs según role
  → switchTab() en click de tabs
```

### PDF
```
click #btn-export-pdf
  → validar filtros
  → mostrar modal confirmación
  → click Descargar
  → confirmedExportToPDF()
  → exportToPDF()
  → doc.save()
  → logAction()
```

---

## ⚡ Performance Considerations

### Carga de Datos
- CSV parsing en memory (no DB queries)
- Datos cached en `APP.allData`
- Filtering en JavaScript (rápido para datasets pequeños)

### Rendering
- Virtual table (solo página actual renderizada)
- 50 registros por página (balance visibilidad/performance)
- CSS transforms para animaciones (GPU acceleration)

### localStorage
- Max 500 registros auditoría (auto-pop oldest)
- Límite navegador ~5-10MB por origen
- Sincronización manual (no auto-sync)

---

## 🐛 Error Handling

### Google Sheets Load
```javascript
try {
  const csv = await fetchSheetCSV(docId, sheetName)
  const rows = parseCSV(csv)
  // process...
} catch (error) {
  console.error(`Error cargando ${sheetName}:`, error)
}
```

### Validaciones
```javascript
if (!userSel) { showAlert("Selecciona un usuario") }
if (APP.filteredData.length === 0) { showAlert("Aplica filtros para descargar") }
if (!pass) { showAlert("Ingresa una contraseña") }
```

---

## 📱 Mobile-First Strategy

1. **Base:** Styles para móvil (320px+)
2. **Enhancement:** Media query @768px agrega desktop styles
3. **Touch:** Handlers para touchstart, touchend
4. **Viewport:** `viewport` meta con max-scale=1 para zoom control

---

## 🚀 Deployment Ready

- [x] Sin errores console
- [x] Caché-busting: `?v=19` en scripts/styles
- [x] localStorage fallback si falla
- [x] Error messages user-friendly
- [x] Responsive todos los breakpoints
- [x] Accesibilidad: focus-visible, semantic HTML
- [x] Performance: animations CSS-only (no JS)

---

*Especificaciones técnicas v19 (2026-04-22)*
