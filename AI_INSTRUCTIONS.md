# AI_INSTRUCTIONS.md

## Universal Project Context System (Works in ANY IDE / Any AI)

---

## INSTRUCCIÓN PARA LA IA - LEE ESTO PRIMERO

Eres un asistente de desarrollo. Responde SIEMPRE en español.
Antes de hacer CUALQUIER cosa, sigue estos pasos:

### PASO 0: Primera instrucción al leer este archivo

Al cargar este archivo, responde inmediatamente en español con este mensaje corto:

```
✅ AI_INSTRUCTIONS.md cargado.
Buscando AGENTS.md...
```

Luego continúa con el PASO 1. No esperes más instrucciones del usuario para este paso.

### PASO 1: Detectar si existe AGENTS.md

**Si AGENTS.md existe:**

- Lee SOLO desde el inicio hasta donde encuentres `<!-- END HANDOFF -->` o `## Project Overview` (lo que aparezca primero)
- Cuando encuentres cualquiera de esas dos marcas, PARA de leer inmediatamente
- NO leas el resto del archivo
- NO escanees el proyecto
- Verifica la fecha en "Meta info" del Handoff → si fue hace más de 5 días avisa: "⚠️ Han pasado más de 5 días desde la última sesión. ¿Quieres que lea el AGENTS.md completo para tener mejor contexto?"
- Resume en 3 líneas dónde quedaron y espera instrucción del usuario

**Si AGENTS.md NO existe:**

- Avisa: "No encontré AGENTS.md. Escaneando proyecto..."
- Escanea todos los archivos del proyecto
- Crea AGENTS.md con la estructura completa (ver sección ESTRUCTURA más abajo)
- Si no puedes escribir el archivo directamente, avisa: "No puedo guardar el archivo directamente en este IDE. Copia el texto de abajo y guárdalo como AGENTS.md en la raíz del proyecto." y muestra el contenido completo para que el usuario lo copie
- Al terminar muestra este mensaje corto:

```
✅ AGENTS.md creado.

Comandos disponibles:
/init      → Lee el Handoff y continúa donde quedaste
/scan      → Escanea el proyecto y actualiza AGENTS.md
/memory    → Guarda la sesión actual (úsalo ANTES de salir o cambiar de IDE)
/new       → Abre conversación nueva manteniendo el contexto (recomendado en sesiones largas)
/compact   → Comprime la conversación sin guardar (solo si no vas a salir)
/clear     → Limpia el historial (pregunta si guardaste antes)
/context   → Muestra cuántos tokens llevas en esta sesión
/rewind    → Regresa a un punto anterior de la conversación
/resume    → Retoma una sesión anterior del historial
/status    → Muestra el estado actual del proyecto
/archive   → Mueve sesiones viejas a AGENTS_HISTORY.md
/recover   → Reconstruye el Handoff si perdiste contexto sin hacer /memory
/help      → Muestra esta lista

⚠️ IMPORTANTE: Usa /memory ANTES de salir o cambiar de IDE.
   Sin esto, la siguiente sesión no sabrá dónde quedaste.
```

---

## COMANDOS DISPONIBLES

Cuando el usuario escriba cualquiera de estos comandos, ejecútalo sin pedir confirmación. Si el comando tiene un typo (ej. `/memorry`, `/inti`, `/compac`, `/nwe`), identifica la intención, avisa brevemente "Entendido, ejecutando /memory..." y procede.

---

### `/init`

**Si AGENTS.md existe:**

1. Lee SOLO el HANDOFF (hasta donde encuentres `<!-- END HANDOFF -->` o `## Project Overview`, lo que aparezca primero)
2. Verifica si última sesión fue hace más de 5 días → avisa si es así
3. Resume en 3 líneas dónde quedaron
4. Espera instrucción

**Si AGENTS.md NO existe:**

1. Escanea TODOS los archivos del proyecto
2. Crea AGENTS.md completo
3. Si no puedes escribir el archivo, muestra el contenido para que el usuario lo copie manualmente
4. Muestra mensaje corto con comandos disponibles (igual que arriba)

---

### `/scan`

1. Escanea TODOS los archivos del proyecto
2. Compara con lo que dice AGENTS.md
3. Detecta diferencias: archivos nuevos, cambios de estructura, dependencias nuevas, features implementadas que estaban como pendientes
4. Actualiza AGENTS.md con diferencias reales
5. Actualiza también el HANDOFF si detecta que el archivo activo cambió
6. Si no puedes escribir el archivo, muestra el contenido actualizado para que el usuario lo copie
7. Muestra resumen corto:

```
🔍 Scan completo:
- Cambios detectados: [lista corta]
- AGENTS.md actualizado: [sí / copia manual requerida]
- Handoff actualizado: [sí/no]
```

---

### `/memory`

1. NO le preguntes nada técnico al usuario. Él puede no saber programar.
2. Revisa tú sola toda la conversación actual y deduce:
   - Qué archivos se mencionaron o modificaron
   - Qué quedó a medias o sin terminar
   - Qué se mencionó como crítico o frágil
   - Cuál fue el último tema o tarea activa
   - Qué sigue lógicamente después
3. Genera el Handoff completo con lo que dedujiste (máximo 1,300 tokens) usando esta plantilla:

```
## 🚀 HANDOFF - Lee esto y ya puedes trabajar

### Qué es este proyecto
[nombre] - [descripción en 1 línea] - [tech stack en 1 línea]

### Dónde quedamos
- Archivo: [ruta exacta]
- Método/función: [nombre]
- Línea aproximada: [número]
- Qué hace: [descripción en 1 línea]
- Qué falta: [descripción específica]

### Qué ya funciona (no repetir)
[lista corta de lo relevante para la tarea actual]

### Código a medias (si hay)
[solo el fragmento relevante, máximo 20 líneas]

### Reglas críticas
- NO tocar: [archivo] porque [razón corta]
- SÍ puedes modificar: [archivos seguros]

### Siguiente paso concreto
[instrucción específica de qué hacer primero al retomar]

### Meta info
- Última sesión: [IDE] - [fecha]

<!-- END HANDOFF -->
```

1. Muestra el Handoff generado y pregunta: "¿Este Handoff está correcto? (sí / corrígeme algo)"
2. Si confirma → sobreescribe el HANDOFF en AGENTS.md y agrega entrada en Session History
3. Si no puede escribir el archivo → muestra el AGENTS.md completo actualizado para que el usuario lo copie manualmente
4. Confirma con mensaje corto:

```
✅ AGENTS.md actualizado.
⚠️ Recuerda: usa /memory ANTES de salir o cambiar de IDE.
```

---

### `/new`

1. Verifica si hubo cambios o avances en esta sesión desde el último /memory
2. Si hubo cambios → ejecuta /memory primero para guardar el estado actual
3. Si no hubo cambios → omite /memory y avisa directamente
4. Después avisa:

```
✅ Listo para sesión nueva.
Abre una conversación nueva en este IDE y escribe:
→ @AI_INSTRUCTIONS.md
La nueva sesión leerá el Handoff y continuará donde quedaste.
```

1. Este comando es la alternativa recomendada a /compact cuando la sesión está larga

---

### `/compact`

**Cuándo usarlo (honestamente):**

- Solo si llevas más de 2 horas en la misma sesión del mismo IDE y la conversación se siente pesada
- NO lo uses si vas a cambiar de IDE o cerrar — para eso usa /memory o /new
- En sesiones cortas (menos de 1 hora) no lo necesitas

**Qué hace:**

1. Resume toda la conversación en un párrafo corto
2. Descarta el historial detallado
3. Continúa trabajando con ese resumen comprimido
4. NO guarda nada en AGENTS.md ni en disco — es solo para aligerar la sesión actual
5. Si cierras el IDE después de /compact sin hacer /memory, pierdes todo
6. Avisa:

```
Conversación comprimida. Sigo con el contexto resumido.
⚠️ Esto NO se guardó. Si vas a salir o cambiar de IDE, usa /memory primero.
```

**Flujo correcto si la sesión está larga:**

```
Opción A (recomendada): /new → guarda y abre sesión nueva limpia
Opción B:               /compact → alivia sin guardar, luego /memory al salir
```

---

### `/clear`

1. Antes de limpiar pregunta: "¿Hiciste /memory antes de limpiar? Si no, hazlo ahora para no perder el avance."
2. Si confirma que sí → limpia historial
3. Si dice no → ejecuta /memory primero, luego limpia
4. Después del clear, lee automáticamente el HANDOFF de AGENTS.md para mantener contexto del proyecto

---

### `/context`

Muestra estimado de uso en la sesión actual:

```
📊 Contexto actual:
- Conversación: ~[N] tokens
- AGENTS.md cargado: ~[N] tokens
- Total estimado: ~[N] tokens
- Recomendación: [OK / Usa /new para abrir sesión limpia / Usa /compact si no vas a salir]
```

⚠️ Nota: /compact NO guarda en AGENTS.md. Si vas a salir o cambiar de IDE, usa /memory o /new.

---

### `/rewind`

1. Muestra los últimos 5 cambios de la conversación
2. Pregunta: "¿A cuál punto quieres regresar?"
3. Descarta lo que pasó después de ese punto
4. Avisa: "Los archivos modificados después de ese punto NO se revierten automáticamente. ¿Quieres que los revise?"

---

### `/resume [sesión]`

1. Lee SOLO las últimas 3 sesiones de Session History en AGENTS.md (no todo el archivo)
2. Si el usuario menciona una sesión específica que no está en las últimas 3, avisa: "Esa sesión está archivada en AGENTS_HISTORY.md. Ábrelo directamente en tu IDE para consultarla."
3. Si no especifica sesión → muestra lista de las últimas 3 sesiones disponibles
4. Reconstruye el contexto de esa sesión y continúa desde ahí

---

### `/status`

1. Lee SOLO el HANDOFF y la sección "Current Status" de AGENTS.md (no todo el archivo)
2. Muestra:

```
📋 [Nombre del proyecto]
✅ Listo: [lista corta]
⏳ En progreso: [lista corta]
⏹️ Pendiente: [lista corta]
🐛 Bugs activos: [lista corta]
📅 Última sesión: [IDE] - [fecha]
📋 Próximo paso: [del Handoff]
```

---

### `/archive`

1. Mueve todas las sesiones de Session History excepto las últimas 3 al archivo AGENTS_HISTORY.md
2. Si AGENTS_HISTORY.md no existe, créalo con esta estructura:

```
# AGENTS_HISTORY.md
## Historial de sesiones archivadas
(sesiones antiguas movidas desde AGENTS.md)

### Session [N] - [IDE] - [Fecha]
- Completed: [lista]
- In Progress: [lista]
- Modified: [archivos]
- Bugs: [lista]
- Important: [notas]
- Next Steps: [lista]
```

1. Si ya existe, agrega las sesiones al final del archivo
2. Actualiza AGENTS.md dejando solo las últimas 3 sesiones
3. Si no puede escribir los archivos, muestra el contenido para copia manual
4. Avisa:

```
📦 Archivado:
- [N] sesiones movidas a AGENTS_HISTORY.md
- AGENTS.md ahora tiene solo las últimas 3 sesiones
- Ahorro aproximado: ~[N] tokens por sesión
```

---

### `/recover`

Úsalo cuando perdiste el contexto sin haber hecho /memory (emergencia).

1. Pregunta al usuario: "¿Recuerdas algo de lo que estabas haciendo? Puedes describirlo en lenguaje normal. Si no recuerdas nada, escribe 'no recuerdo' y haré un /scan del proyecto."
2. Si el usuario describe algo → genera el Handoff con esa info usando la plantilla de /memory (máximo 1,300 tokens)
3. Si el usuario dice "no recuerdo" → ejecuta /scan automáticamente para reconstruir el contexto desde los archivos actuales
4. Muestra el Handoff generado y pregunta: "¿Esto representa bien dónde quedaste? (sí / corrígeme algo)"
5. Si confirma → guarda en AGENTS.md como si fuera /memory normal
6. Avisa:

```
✅ Contexto recuperado y guardado en AGENTS.md.
Para evitar esto en el futuro: usa /memory antes de salir.
```

---

### `/help`

Muestra este mensaje:

```
Comandos disponibles:
/init      → Lee el Handoff y continúa donde quedaste
/scan      → Escanea el proyecto y actualiza AGENTS.md
/memory    → Guarda la sesión actual (úsalo ANTES de salir o cambiar de IDE)
/new       → Guarda y te indica cómo abrir sesión nueva limpia (recomendado en sesiones largas)
/compact   → Comprime la conversación SIN guardar (solo si no vas a salir pronto)
/clear     → Limpia el historial (pregunta si guardaste antes)
/context   → Muestra cuántos tokens llevas en esta sesión
/rewind    → Regresa a un punto anterior de la conversación
/resume    → Retoma una sesión anterior del historial (últimas 3)
/status    → Muestra el estado actual del proyecto
/archive   → Mueve sesiones viejas a AGENTS_HISTORY.md
/recover   → Reconstruye el Handoff si perdiste contexto sin hacer /memory
/help      → Muestra esta lista

⚠️ IMPORTANTE: Usa /memory ANTES de salir o cambiar de IDE.
```

---

## ESTRUCTURA AGENTS.md (cuando lo crees desde cero)

Usa EXACTAMENTE esta estructura. El HANDOFF siempre va primero.
⚠️ Escribe TODO el contenido del AGENTS.md en español, sin excepción. Esto incluye secciones, descripciones, notas y comentarios.

```
## 🚀 HANDOFF - Lee esto y ya puedes trabajar

### Qué es este proyecto
[nombre] - [descripción en 1 línea] - [tech stack en 1 línea]

### Dónde quedamos
- Archivo: [ruta]
- Método/función: [nombre]
- Línea aproximada: [número]
- Qué hace: [descripción]
- Qué falta: [descripción específica]

### Qué ya funciona (no repetir)
[lista corta relevante]

### Código a medias (si hay)
[fragmento, máximo 20 líneas]

### Reglas críticas
- NO tocar: [archivo] porque [razón]
- SÍ puedes modificar: [archivos seguros]

### Siguiente paso concreto
[instrucción específica]

### Meta info
- Última sesión: [IDE] - [fecha]

<!-- END HANDOFF -->

---

# [NOMBRE DEL PROYECTO]

## Project Overview
- Purpose: [qué es]
- Target: [para quién / dónde corre]
- Timeline: [tiempo estimado]
- Status: [Early / Mid / Near completion]

## Tech Stack
- Frontend: [tecnología]
- Backend: [tecnología]
- Database: [tecnología]
- APIs: [servicios externos]
- Hosting: [dónde]

## Project Structure
[estructura real de carpetas escaneada]

## Critical Files (NO MODIFICAR sin entender)
[archivos críticos detectados]

## Safe to Modify (OK para cualquier IDE)
[carpetas seguras]

## IDE Routing (qué IDE usar para qué)
- Lógica compleja / arquitectura → Claude Code / Windsurf
- Bugfix rápido / UI            → Cursor
- Feature nueva / scaffolding   → Antigravity
- Tutorial / aprender           → VS Code

## Current Status

### Features Completed
[lista]

### Features In Progress
[lista]

### Features Not Started
[lista]

## Known Issues

### Active Bugs
[lista]

### Architectural Decisions
[decisiones importantes y por qué]

## Session History
(máximo 3 sesiones aquí, el resto va a AGENTS_HISTORY.md con /archive)

### Session 1 - [IDE] - [Fecha]
- Completed: [lista]
- In Progress: [lista]
- Modified: [archivos]
- Bugs: [lista]
- Important: [notas]
- Next Steps: [lista]
```

---

## COMPORTAMIENTO GENERAL

1. **Responde siempre en español**
2. **AGENTS.md es la fuente de verdad** - Si hay conflicto con el código real, confía en AGENTS.md. Solo confía en el código si el usuario ejecuta /scan
3. **Handoff máximo 1,300 tokens** - Contexto completo sin desperdiciar. Incluye código a medias, decisiones importantes y detalles técnicos necesarios para que la siguiente IA trabaje sin preguntar nada.
4. **Modelo recomendado para leer Handoff** - Haiku sin razonamiento es suficiente para leer el HANDOFF y continuar. Usa modelos más potentes solo para tareas complejas de código o arquitectura.
5. **Confirma el Handoff antes de guardar** - Muéstralo y pregunta si está correcto
6. **Avisa si última sesión fue hace más de 5 días** - Recomendar leer AGENTS.md completo
7. **Avisa si hay cambios sin guardar** - Si llevan más de 1 hora trabajando o completaron algo importante sin hacer /memory, avisar: "⚠️ Llevas un buen rato sin guardar. ¿Hacemos /memory antes de continuar?"
8. **Respeta Critical Files** - Avisar antes de tocar algo crítico: "Este cambio afecta un archivo crítico, ¿confirmas?"
9. **Tolerancia a typos** - Identifica comandos mal escritos y ejecuta el correcto avisando brevemente
10. **Session History máximo 3 entradas** - Si hay más de 3, sugerir /archive automáticamente
11. **No escanees si AGENTS.md existe** - Solo cuando el usuario pide /scan explícitamente
12. **Si no puedes escribir archivos** - Muestra el contenido completo para que el usuario lo copie manualmente. Nunca falles en silencio
13. **Sugerencia automática de /memory** - Si el usuario completa algo importante (una feature, un bugfix, una decisión de arquitectura) o llevan más de 45 minutos activos, sugiere al final de tu respuesta: "💾 Buen momento para hacer /memory y guardar este avance."
14. **Sugerencia automática de /new** - Si estimas que el contexto total supera ~3,000 tokens de conversación, al final de tu respuesta sugiere: "📦 La sesión está creciendo. Considera /new para abrir una sesión limpia y ahorrar tokens."
15. **No envíes archivos completos innecesariamente** - Nunca cargues ni muestres un archivo completo si solo necesitas una función o sección. Siempre trabaja con el fragmento mínimo necesario. Si necesitas contexto de un archivo, pide al usuario solo la parte relevante.

---

## LO ÚNICO QUE NECESITAS RECORDAR

```
Al entrar a cualquier IDE:
→ @AI_INSTRUCTIONS.md

Al salir o cambiar de IDE:
→ /memory

Sesión muy larga en mismo IDE:
→ /new

¿Olvidaste algo?
→ /help
```

---

*Sistema universal de contexto para proyectos multi-IDE.*
*Funciona con cualquier IA: Claude, GPT, Gemini, Cursor AI, Antigravity AI, etc.*
