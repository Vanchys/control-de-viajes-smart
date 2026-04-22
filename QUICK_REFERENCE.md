# Smart Dashboard - Guía Rápida de Referencia

## 🎨 COLORES
```
Primario:  #2D74B4 (azul marca)
Verde:     #6CA636 
Oro:       #F2B705
Fondo:     #FFFFFF (blanco puro)
Texto:     #0F1419 (casi negro)
Border:    #D5DDE5 (gris azulado)
```

## 🔤 FUENTES
```
Títulos/KPIs:  Fraunces (serif) - font-weight: 600
UI/Botones:    Manrope (sans) - font-weight: 600
Monospace:     JetBrains Mono
```

## 👥 USUARIOS (passwords)
```
Ivan (Admin)           → password: "1"
Timoteo (User)         → password: "arminio"
admin (SuperAdmin)     → password: "ivan1.1" [oculto, se desbloquea]
```

## 🔑 DESBLOQUEAR ADMIN (Easter Egg)
```
1. Selecciona: Ivan
2. Contraseña: 1 ✅
3. Aparece "admin" en dropdown
4. Selecciona: admin
5. Contraseña: ivan1.1 ✅
```

## 📂 ESTRUCTURA ARCHIVOS
```
index.html          → HTML
css/styles.css      → Estilos (v19 - blanco puro)
js/auth.js          → Usuarios, contraseñas, modales
js/app.js           → Filtros, tabla, PDF
js/data.js          → Google Sheets, parsing
```

## 🎯 COMPONENTES PRINCIPALES

### KPIs
- 3 cards: BRUTO, NETO, VOUCHER
- Números grandes `Fraunces 600`
- Barra lateral de color
- Reveal escalonado

### Sidebar Filtros
- Rango fechas
- Rutas (4 opciones)
- **Unidades:** 4 filas (scroll)
- **Conductores:** 2 filas (scroll)
- Botones: Aplicar, Limpiar, Todas, Ninguna

### Tabla
- Ordenable (click header)
- Búsqueda en tiempo real
- Paginación 50 registros
- Colores: neto positivo (verde), negativo (rojo)

### Password Toggle
- Botón pequeño **ARRIBA** del input
- Texto: "Mostrar" / "Ocultar"
- Estado activo: fondo azul claro
- Sin ícono

### PDF Export
- Click → Modal "¿Descargar?"
- Botones: Cancelar | Descargar PDF
- Auditoría registrada

## ⚙️ MODAL AJUSTES
```
Tab 1: Cambiar Contraseña [activo]
Tab 2: Gestión de Usuarios
Tab 3: Auditoría [solo SuperAdmin]
```

## 🔐 SESIÓN
- Timeout: 15 minutos
- Reset: mousemove, click, keypress, touchstart
- Auditoría: Todo registrado

## 📊 DATOS
- Fuente: Google Sheets
- ID: `12DKb_WTfxjAay5TDjzbhqLmWoc-ROfK-FubZbW3l5vQ`
- Mes: "Smart 03 2026" (actualizable)
- Rutas: Teh-Pue, Pue-Teh, Teh-Mex, Mex-Teh

## 🎬 ANIMACIONES
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (spring)
- Duración: 220ms (estándar)
- KPIs reveal: 40ms, 120ms, 200ms (escalonado)
- Splash: 2s total

## 📱 RESPONSIVE
```
Móvil:   Sidebar fuera (-100%), toggle hamburguesa
         Tabla scroll horizontal
         
Desktop: Sidebar visible siempre (280px ancho)
         Dashboard con margin-left: 280px
         KPIs 3 columnas
```

## 🚀 PARA MODIFICAR

### Agregar nuevo mes
```javascript
// En js/data.js, agregar a SHEETS_CONFIG.documents:
{
  id: "GOOGLE_SHEET_ID",
  name: "Smart 04 2026",
  month: "2026-04",
  sheets: [
    { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
    // ... resto sheets
  ]
}
```

### Cambiar colores primarios
```css
/* En css/styles.css, variables :root */
--brand-blue: #NUEVO_COLOR;
--brand-green: #NUEVO_COLOR;
--brand-gold: #NUEVO_COLOR;
```

### Cambiar fuentes
```css
--font-display: 'NUEVA_FUENTE', serif;
--font-sans: 'NUEVA_FUENTE', sans-serif;
```

### Agregar usuario predeterminado
```javascript
// En js/auth.js, agregar a DEFAULT_USERS:
{ username: "nombre", password: "pass", role: "user" }
```

## 🐛 DEBUG
```javascript
// Console browser
APP                          // Estado app
currentUser                  // Usuario sesión
users                        // Array usuarios (localStorage)
auditLog                     // Array auditoría (localStorage)

// LocalStorage
localStorage.getItem('smart_users')
localStorage.getItem('smart_audit')
```

## ✅ CHECKLIST VISUAL

- [x] Login blanco + password toggle arriba
- [x] Sidebar navy (móvil modal, desktop visible)
- [x] KPIs con Fraunces grande y visible
- [x] Unidades 4 filas, Conductores 2 filas
- [x] Tabla blanca con scroll y hover suave
- [x] PDF con modal sí/no elegante
- [x] Ajustes con 3 tabs (contraseña primero)
- [x] Password toggle: pequeño, arriba, activo con bg azul
- [x] Diseño blanco puro (sin arena)
- [x] Tipografía Fraunces + Manrope

---

**Última versión:** v19 (2026-04-22)
