# Smart Dashboard - Historial de Cambios (Changelog)

## v19 (2026-04-22) - Rediseño Visual & Correcciones Finales

### 🎨 Diseño
- ✅ **Paleta arena → Blanco puro**
  - `#F5F1EA` → `#FFFFFF` (fondo principal)
  - `#FBF8F2` → `#FFFFFF` (fondo secundario)
  - `#EEE7D8` → `#E5EBF3` (bordes, azul pálido)
  - Contraste mejorado con bordes `#D5DDE5` (gris azulado)

- ✅ **Tipografía mejorada**
  - KPI values: `font-weight: 500` → `600`
  - Tamaño: `clamp(1.35rem, 4.5vw, 2.1rem)` → `clamp(1.5rem, 5vw, 2.4rem)`
  - Unit stats: `font-weight: 500` → `600`, `1rem` → `1.05rem`
  - Tabla: `font-variant-numeric: tabular-nums linum-nums`

### 🔐 Seguridad
- ✅ **Easter Egg Admin corregido**
  - Problema: comparaba contraseña superadmin en lugar de Ivan
  - Solución: verificar Ivan con password "1" → desbloquea admin
  - Archivo: [app.js:48-63](js/app.js#L48-L63)

### 🔑 Contraseñas
- ✅ **Toggle "Mostrar Contraseña" rediseñado**
  - **Antes:** Ojito (👁️) dentro del recuadro, no funcionaba
  - **Ahora:**
    - Botón pequeño ARRIBA del input
    - Texto: "Mostrar" / "Ocultar" (cortito)
    - Sin ícono
    - Estado `.active`: fondo azul claro (#rgba(45,116,180,0.15))
    - Posición: `align-self: flex-start`
  - Aplicado en: Login, Cambiar Contraseña, Crear Usuarios, SubUsers

- ✅ **Función `togglePasswordVisibility()` mejorada**
  - Agrega/quita clase `.active` al botón
  - Cambia texto dinámicamente
  - Archivo: [auth.js:261-273](auth.js#L261-L273)

### 📥 PDF Export
- ✅ **Modal elegante de confirmación**
  - **Antes:** Botón cambiaba a "¿Confirmar PDF?" (confuso)
  - **Ahora:** Modal popup con:
    - Título: "Descargar Reporte en PDF"
    - Descripción clara
    - Botones: Cancelar | Descargar PDF
    - Descarga real al confirmar
  - Archivo: [index.html:263-280](index.html#L263-L280)

### 🎛️ Filtros
- ✅ **Grids optimizados**
  - Unidades: 5 filas → **4 filas** (`scroll-x-grid-4`)
  - Conductores: 4 filas → **2 filas** (`scroll-x-grid-2`)
  - Agregada clase `.scroll-x-grid-2` al CSS
  - Archivo: [index.html:125, 131](index.html)

### ⚙️ Modal Ajustes
- ✅ **Reordenación de pestañas**
  - **Antes:** Gestión Usuarios (activo) → Auditoría → Mi Cuenta
  - **Ahora:** Cambiar Contraseña (activo) → Gestión Usuarios → Auditoría

- ✅ **Simplificación tabla usuarios**
  - Removida tabla de usuarios del modal (sin uso)
  - Focus en crear/editar usuarios
  - UI más limpia

- ✅ **Función `switchTab()` corregida**
  - **Antes:** Usaba clase `.hidden` (no definida correctamente)
  - **Ahora:** Usa clase `.active` para mostrar/ocultar
  - Archivo: [auth.js:179-184](auth.js#L179-L184)

### 📱 Responsividad
- ✅ **Componentes adaptados**
  - Header: sombra sutil agregada
  - Botones icon: fondo `#F5F8FC` para mejor contraste
  - Inputs: focus rings más visibles (azul claro)
  - Tabla: hover color actualizado a `#F5F8FC`

### 🔗 Librerias & Fuentes
- ✅ **Fuentes agregadas a Google Fonts**
  - `Manrope` (UI) - wght 300-800
  - `Fraunces` (Display) - opsz 9-144, wght 400-700
  - `JetBrains Mono` (Monospace) - wght 500-600

---

## v18 (2026-04-22) - Correcciones de Funcionalidad

### 🔐 Autenticación
- ✅ PDF export con modal de confirmación
- ✅ Auditoría de descargas
- ✅ Validación de filtros antes de exportar

---

## v17 (2026-04-22) - Gestión de Usuarios

### 👥 Usuarios
- ✅ Roles jerárquicos (SuperAdmin > Admin > User > SubUser)
- ✅ Límites de creación (User solo 2 sub-usuarios)
- ✅ Restricciones de edición por rol
- ✅ Auditoría completa de acciones

---

## v16 (2026-04-22) - Correcciones Mobile

### 📱 Mobile
- ✅ Reparación de pestañas (tabs) en móvil
- ✅ Botones de ajustes responsivos
- ✅ Modal settings accesible

---

## v15 (2026-04-22) - Optimización de Filtros

### 🎛️ Filtros
- ✅ Cuadrícula inteligente de unidades (4 filas)
- ✅ Cuadrícula inteligente de conductores (3 filas)
- ✅ Botones de acción rápida (Todas/Ninguna)
- ✅ Selectores compactos

---

## v14 (2026-04-22) - Compactación de UI

### 🎨 Diseño
- ✅ Reducción de márgenes y padding en sidebar
- ✅ Optimización de tamaños de fuente
- ✅ Panel filtros más compacto

---

## v13 (2026-04-22) - Rediseño Visual Inicial

### 🎨 Diseño Editorial
- ✅ Paleta arena (off-white cálido)
- ✅ Tipografía Fraunces + Manrope
- ✅ KPIs con números grandes
- ✅ Sidebar navy profundo
- ✅ Cards premium con halos
- ✅ Animaciones suaves (spring easing)
- ✅ Grano visual editorial

---

## v12 y anteriores

### 🏗️ Arquitectura Base
- ✅ Login con autenticación
- ✅ Google Sheets integration
- ✅ Tabla de viajes con filtros
- ✅ KPIs BRUTO/NETO/VOUCHER
- ✅ Análisis por unidad
- ✅ PDF export
- ✅ Sesión con timeout
- ✅ Auditoría
- ✅ Gestión de usuarios

---

## 📝 Notas de Desarrollo

### Cambios Recientes (v19)
1. **Paleta visual:** Arena → Blanco (decisión usuario por legibilidad)
2. **Botón password:** Interior → Exterior (arriba del input)
3. **Grid conductores:** 4 → 2 filas (compactación)
4. **PDF:** Botón estado → Modal elegante
5. **Admin Easter Egg:** Verificación corregida
6. **Modal ajustes:** Reordenada y simplificada

### Decisiones de Diseño
- **Blanco puro:** Máximo contraste con azul de marca
- **Bordes azul gris:** `#D5DDE5` contrasta bien en blanco
- **Password toggle arriba:** Mejor UX, no interfiere con input
- **2 filas conductores:** Optimización mobile sin scroll excesivo
- **Modal PDF:** Evita clics accidentales

### Testing
- [x] Login flujo completo
- [x] Easter Egg admin desbloqueado
- [x] Password toggle funciona en todos inputs
- [x] PDF descarga real (no cambio de botón)
- [x] Filtros funcionan correctamente
- [x] Sesión timeout 15 min
- [x] Auditoría registra eventos
- [x] Responsive mobile y desktop

---

## 🔮 Próximas Posibles Mejoras

- [ ] Dark mode toggle
- [ ] Gráficos de análisis (Chart.js)
- [ ] Exportación a Excel
- [ ] Filtros guardados (presets)
- [ ] Notificaciones en tiempo real
- [ ] Multi-idioma (ES/EN)
- [ ] Integración con CRM
- [ ] Dashboard widgets personalizables

---

*Última actualización: 2026-04-22 v19*
