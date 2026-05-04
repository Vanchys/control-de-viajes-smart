# Plan de Trabajo: Rediseño Visual "Control de Viajes Smart"

## Resumen

Rediseñar la interfaz manteniendo la lógica actual intacta. El trabajo será principalmente en `css/styles.css`, con ajustes puntuales en `index.html`, `js/app.js` y `js/auth.js` solo para quitar estilos inline o agregar clases necesarias. Todo el rediseño debe ser completamente responsivo, con atención especial al panel de filtros en teléfonos.

## Fase 1: Base de Marca y Variables

**Archivos:** `css/styles.css`

1. Actualizar `:root` con la paleta oficial:
   - `--brand-blue: #1B4F8A`
   - `--brand-green: #4CAF50`
   - `--brand-gold: #F5A623`
   - `--accent-red: #E53935`
   - `--bg-dark: #0D2137`
   - `--bg-light: #F0F4F8`
2. Mantener aliases existentes como `--accent-blue`, `--accent-green`, `--accent-yellow` para no romper referencias actuales.
3. Actualizar gradientes, rings, sombras y colores derivados para que salgan de la nueva paleta.
4. Cambiar fondo general de `body` y `#dashboard` a `#F0F4F8`.

## Fase 2: Limpieza Visual Segura de HTML

**Archivos:** `index.html`, `css/styles.css`

1. Quitar estilos inline visuales del login, botones, modales y filtros cuando exista una clase equivalente.
2. Agregar clases específicas donde haga falta:
   - selector usuario login
   - botón PDF
   - encabezado de filtro de fechas
   - modal de meses
   - modal de alerta
   - modal PDF
3. No cambiar estructura funcional, IDs ni orden de scripts.
4. Mantener intacto `window.SMART_DASHBOARD_RELEASE`.

## Fase 3: Login y Botones

**Archivos:** `css/styles.css`, `index.html`

1. Rediseñar botón `.btn-primary`, incluyendo "Entrar":
   - gradiente azul oficial
   - bordes redondeados
   - sombra suave
   - estado hover/active/focus
2. Pulir `.btn-small`, `.btn-tiny`, `.btn-actions` con variantes coherentes.
3. Crear dropdown personalizado visual para `#username`:
   - apariencia limpia
   - flecha custom con CSS
   - foco azul oficial
   - fondo claro
4. Mantener el `<select>` nativo para no tocar lógica de login ni accesibilidad.

## Fase 4: KPIs BRUTO / NETO / VOUCHER

**Archivos:** `css/styles.css`

1. Rediseñar `.kpi-card` con gradientes de marca:
   - BRUTO: azul `#1B4F8A`
   - NETO: verde `#4CAF50`
   - VOUCHER: amarillo/dorado `#F5A623`
2. Ajustar texto, contraste y sombras para lectura clara.
3. Mantener IDs actuales:
   - `#kpi-bruto`
   - `#kpi-neto`
   - `#kpi-voucher`
4. No tocar `renderKPIs()` porque solo actualiza valores.

## Fase 5: Panel de Filtros

**Archivos:** `css/styles.css`, `index.html`

1. Fijar fondo del panel en `#0D2137`.
2. Rediseñar `.filter-group` como secciones delimitadas con recuadro.
3. Agregar acento por sección:
   - Fechas: azul
   - Rutas: verde
   - Unidades: amarillo
   - Conductores: rojo/coral o azul secundario si el rojo se ve demasiado alerta
4. Mantener el comportamiento mobile bottom-sheet actual.
5. Corregir responsividad móvil para que el botón `Aplicar Filtros` nunca quede oculto, cortado ni a media pantalla:
   - usar alto real de viewport móvil (`100dvh` o fallback compatible)
   - separar área scrolleable de filtros y área fija del botón
   - respetar zonas seguras de teléfonos con notch/barra inferior usando `env(safe-area-inset-bottom)`
   - evitar que el teclado o barras del navegador tapen el botón cuando sea posible
6. Conservar IDs de inputs, checkboxes y botones para no romper `js/app.js`.

## Fase 6: Tabla y Valores Monetarios

**Archivos:** `css/styles.css`, `js/app.js`

1. Agregar clases semánticas en filas generadas por `renderTable()`:
   - `cell-bruto`
   - `cell-neto`
   - `cell-voucher`
2. Aplicar colores:
   - BRUTO azul
   - NETO verde si positivo
   - VOUCHER amarillo
   - negativos rojo `#E53935`
3. Reemplazar el `style="color:var(--accent-orange)"` del voucher por clase CSS.
4. Mantener lógica de cálculo, paginación, búsqueda y ordenamiento sin cambios.

## Fase 7: Modales y Selector de Mes

**Archivos:** `css/styles.css`, `index.html`

1. Mejorar `.modal-content` con sombras suaves y borde sutil.
2. Dar al modal "Seleccionar Mes" una clase específica.
3. Aplicar color de marca al header del modal de meses, botones activos y foco.
4. Mantener IDs:
   - `month-picker-modal`
   - `months-grid`
   - `btn-close-months`
   - `month-picker-year`
5. No tocar la lógica de selección mensual en `setupMonthPicker()`.

## Fase 8: HTML Dinámico de Usuarios y Resumen

**Archivos:** `js/auth.js`, `js/app.js`, `css/styles.css`

1. Reemplazar estilos inline visuales de `auth.js` por clases CSS donde sea necesario:
   - tablas de usuarios
   - badges de rol
   - botones de eliminar/cerrar sesión
2. En `js/app.js`, reemplazar estilos inline del resumen por clases:
   - tarjeta total combinado
   - valor voucher
   - descripción del total
3. No modificar credenciales, roles, auditoría ni reglas de permisos.

## Fase 9: Validación Visual y Técnica

**Archivos:** sin cambios esperados

1. Probar login visualmente con usuario normal.
2. Confirmar que el selector de usuario conserva opciones dinámicas.
3. Abrir filtros en desktop y mobile.
4. Aplicar filtros y revisar:
   - KPIs
   - tabla
   - resumen por unidad
   - modal de meses
   - modal PDF
   - modal ajustes
5. Probar específicamente el panel de filtros en teléfonos chicos y medianos:
   - 320px de ancho
   - 360px de ancho
   - 390px/393px de ancho
   - orientación vertical y, si es viable, horizontal
   - confirmar que `Aplicar Filtros` se ve completo, se puede tocar y no queda debajo de la barra inferior del navegador
6. Verificar que no haya errores de consola por clases/IDs cambiados.
7. Confirmar que `auth.js`, `app.js` y `data.js` siguen cargando con cache busting.

## Orden Recomendado

1. Variables globales y fondo.
2. Botones y controles base.
3. Login y dropdown de usuario.
4. KPIs.
5. Panel de filtros, incluyendo corrección del botón `Aplicar Filtros` en móvil.
6. Tabla.
7. Modales.
8. Limpieza de estilos inline dinámicos.
9. Prueba completa responsive.

## Supuestos

- No se modifican Google Sheets, passwords, usuarios base ni lógica de autenticación.
- El rediseño será CSS-first; JavaScript solo se tocará para cambiar estilos inline por clases.
- Se conservarán todos los IDs actuales usados por eventos y renderizado.
- La corrección responsiva debe priorizar teléfonos reales: el botón principal de filtros debe permanecer visible y usable aunque el contenido del panel sea largo.

## Tareas Adicionales

- Tarea 10: Optimización de carga de recursos
  - Descripción: Minificar CSS y JS, eliminar estilos no usados, asegurar cache busting sin romper compatibilidad.
  - Prioridad: alta
  - Archivos afectados: css/styles.css, index.html
  - Criterios de aceptación: Tamaño de CSS reducido, no romper UI, pruebas manuales pasan
  - Dependencias: Ninguna

- Tarea 11: Accesibilidad y navegación por teclado
  - Descripción: Reforzar accesibilidad (contraste, foco visible, etiquetas ARIA donde aplique).
  - Prioridad: media
  - Archivos afectados: css/styles.css, index.html, js/app.js
  - Criterios de aceptación: Contraste adecuado; foco visible; lectura de screen reader mejora
  - Dependencias: Ninguna

- Tarea 12: Plan de pruebas de regresión
  - Descripción: Crear y adjuntar una checklist de pruebas de regresión para todas las fases.
  - Prioridad: baja
  - Archivos afectados: plan.md
  - Criterios de aceptación: Checklist documentada y referenciada en PR/commit
  - Dependencias: Ninguna
Versión actual: 2.1.3
