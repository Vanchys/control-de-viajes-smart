# plan2_header_fix_v1.1.md
Versión: v1.1
Objetivo
- Alinear el header del panel de filtros para que el ícono de engranaje y el texto queden en una misma línea y bien alineados.

Contexto
- Basado en PASO 1 de plan2.md. Se propone dividir el título y el icono del encabezado para lograr alineación precisa.

Patch propuesto (diff de ejemplo)
*** Begin Patch
*** Update File: index.html
@@
    <div class="filter-title" aria-label="Filtros" style="display:inline-flex; align-items:center; gap:6px;">
      <span class="filter-gear" aria-hidden="true">⚙️</span> Filtros
    </div>
