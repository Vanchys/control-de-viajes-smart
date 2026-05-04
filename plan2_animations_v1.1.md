# plan2_animations_v1.1.md
Versión: v1.1
Objetivo
- Mejorar visualmente los botones del menú de filtros con animaciones suaves, mejor contraste y presencia.

Contexto
- Basado en PASO 3 del plan2.md. Se implementarán efectos hover, enfoque y estado activo.

Patch propuesto (diff de ejemplo)
*** Begin Patch
*** Update File: css/styles.css
@@
-.filter-menu button {
.filter-menu button {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 4px;
  color: #333;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,.08);
}
*** End Patch
