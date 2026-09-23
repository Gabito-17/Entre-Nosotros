# Módulo Torneo — Entrenosotros App

## Contexto
La app ya tiene un anotador de truco a 15, 18 y 30 puntos. Se agrega un modo
torneo para juntadas con muchos equipos, que reutiliza ese anotador.

## Funcionalidades

### 1. Configuración del torneo
- Nombre del torneo.
- Puntos por partida: 15, 18 o 30 (se pasan al anotador).
- Formato:
  - **Liga (todos contra todos):** gana quien encabeza la tabla.
  - **Eliminación directa:** el que pierde queda afuera.
- Armado de cruces: **automático** (sorteo) o **manual** (el usuario elige quién juega contra quién).

### 2. ABM de equipos
- Crear, editar y eliminar equipos (nombre del equipo + participantes).
- Mínimo 2 equipos para iniciar.
- Una vez iniciado el torneo, no se pueden agregar ni quitar equipos (sí editar nombres).

### 3. Motor de cruces ("módulo inteligente")
- **Liga:** fixture por método del círculo (round robin). Con cantidad impar
  de equipos, en cada ronda un equipo queda **libre**, rotando para que nadie
  quede libre dos veces antes que otro.
- **Eliminación:** si la cantidad de equipos no es potencia de 2, se otorgan
  **pases libres** en la primera ronda para que la segunda sí lo sea
  (ej: 6 equipos → 2 pases libres y 2 partidos entre los otros 4; a la
  segunda ronda llegan 4: los 2 ganadores y los 2 con pase libre).
- Modo manual: validar que ningún equipo juegue dos veces en la misma ronda.

### 4. Integración con el anotador
- Desde un partido del torneo se abre el anotador existente con los nombres
  de ambos equipos y el puntaje configurado.
- Al terminar, el resultado (tantos de cada equipo) vuelve al torneo automáticamente.
- Opción de cargar un resultado a mano (si se anotó en papel).
- Opción de corregir un resultado ya cargado.

### 5. Tabla y podio
- **Liga:** tabla con PJ, PG, PP, tantos a favor, tantos en contra y diferencia.
  Orden: partidos ganados → diferencia de tantos → tantos a favor.
- **Eliminación:** vista de llaves por ronda.
- Al finalizar: **podio** con 1°, 2° y 3° puesto.

### 6. Persistencia
- El torneo en curso se guarda localmente y se puede retomar si se cierra la app.
- Historial de torneos terminados con su podio.

## Modelo de datos (orientativo)
- Torneo: id, nombre, formato, modoCruces, puntosPartida, estado, fecha
- Equipo: id, nombre, participantes[]
- Ronda: número, partidos[], equipoLibre?
- Partido: id, equipoA, equipoB, tantosA, tantosB, ganador, estado

## Decisiones pendientes
- ¿Eliminación con partido por el 3er puesto o se define por tantos?
- ¿Liga a una sola vuelta o ida y vuelta?
