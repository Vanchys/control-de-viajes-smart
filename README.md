# Smart Dashboard

Dashboard operativo para control y análisis de viajes de transporte terrestre de **Smart Transports** (rutas Tehuacán ↔ Puebla y Tehuacán ↔ CDMX).

## Descripción

Aplicación web de una sola página (HTML + CSS + JavaScript vanilla, sin frameworks ni build system) que consume datos en tiempo real desde Google Sheets públicos y los presenta como KPIs, tarjetas por unidad y una tabla filtrable, con exportación a PDF y Excel.

## Características

- Login con roles (`superadmin`, `admin`, `user`, `subuser`) y sesión con expiración por inactividad (15 min)
- Carga asíncrona de datos desde múltiples documentos de Google Sheets (un documento por mes)
- Filtros por rango de fechas (con selector rápido de mes), rutas, unidades y conductores
- KPIs en tiempo real: Bruto, Neto, Voucher
- Tarjetas de resumen por unidad + tarjeta de total combinado
- Tabla de viajes con ordenamiento por columna, búsqueda y paginación
- Exportación de reportes (completo y de vouchers) a PDF y Excel
- Gestión de usuarios desde la interfaz, con permisos según rol
- Registro de auditoría de acciones (solo visible para superadmin)
- Diseño responsivo: funciona en celular, tablet y escritorio

## Requisitos

- Un navegador web moderno
- Conexión a internet (los datos se leen en vivo desde Google Sheets)

## Uso

1. Clona o descarga este repositorio.
2. Abre `index.html` directamente en tu navegador, o sírvelo con un servidor estático local (por ejemplo `npx serve .`) para evitar restricciones de algunos navegadores con `file://`.
3. Inicia sesión con un usuario válido.

## Tecnologías

- HTML5 + CSS3 (vanilla)
- JavaScript ES6+ (vanilla)
- [jsPDF](https://github.com/parallax/jsPDF) + jspdf-autotable — exportación a PDF
- [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) — exportación a Excel
- Google Sheets como fuente de datos (CSV público)

## Autor

Desarrollado por Ivan Apolinar.
