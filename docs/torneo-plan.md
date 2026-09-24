# Plan — Módulo Torneo (truco)

## Contexto
`docs/torneo-spec.md` define un modo torneo (liga o eliminación, cruces automáticos o manuales,
tabla, podio e historial) que tiene que **reutilizar el anotador de truco existente** sin duplicar
lógica. Decisiones ya tomadas con el usuario:
- Fases ordenadas por dependencia (F1–F6 abajo).
- Si hay una partida libre a medias, al abrir un partido del torneo se **guarda y se restaura** al salir.
- 3er puesto en eliminación: mejor diferencia **en la semifinal perdida** (empate → tantos a favor en esa semi).
  Con 3 equipos, el 3° es el perdedor de la 1ª ronda; con 2 equipos no hay 3°.
- Al corregir un resultado de eliminación que cambia el ganador: con confirmación, se **invalidan** los
  resultados posteriores que dependían de él y se rearman esos cruces.

## 1. Cómo funciona hoy el anotador de truco
- **Estado:** `src/stores/useGameTrucoStore.ts`, un store Zustand global persistido en `localStorage`
  (`truco-config`). Guarda `maxScore`, `pointStyle`, `score1/2`, `winner`, `nombre1/2`. `addPoint` limita el
  puntaje a `[0, maxScore]` y marca `winner` cuando un equipo llega al máximo. `setMaxScore` reinicia la partida.
- **UI:** `/truco/anotador` → `AnotattorTrucoPage` → `game/TanteadorTruco.tsx`, que arma `ConfigurationBar`
  (puntero, selector 15/18/30, reinicio) y dos `PanelEquipo` (nombre editable, +/−, `ScoreDisplay`).
  Ningún componente recibe props de partida: **todos leen el store directo**.
- **Fin de partida:** `TanteadorTruco` observa `winner`, abre `GameOverTrucoModal` a través de `useUiStore.openGameOverModal`,
  y el único botón ("¡Revancha!") llama a `resetScores`.
- **Bugs que el torneo deja a la vista** (hay que corregirlos igual):
  - El modal muestra siempre "NOSOTROS"/"ELLOS", no los nombres reales (`TanteadorTruco.tsx`).
  - El color de `PanelEquipo` depende de que el nombre sea `"NOSOTROS"`, así que con nombres de equipo se pierde el color.
    La corrección es que dependa de `equipo === "equipo1"`.

### Reutilización sin duplicar
El anotador sigue siendo **uno solo** (misma ruta y mismos componentes). Se le agrega al store un
"contexto de partido de torneo":
- En `useGameTrucoStore`:
  - `partidoTorneo: { torneoId, partidoId } | null`
  - `partidaLibreGuardada: { maxScore, score1, score2, winner, nombre1, nombre2 } | null`
  - `iniciarPartidoTorneo({ torneoId, partidoId, nombre1, nombre2, maxScore })` guarda la partida libre,
    carga los nombres y el puntaje del torneo y pone los tantos en 0.
  - `salirPartidoTorneo()` restaura la partida libre y limpia el contexto.
  - Todo esto se persiste, así que si se cierra la app a mitad de un partido se retoma igual.
- Cambios en el modo torneo (todo condicionado a `partidoTorneo != null`):
  - `ConfigurationBar` bloquea el selector 15/18/30.
  - `PanelEquipo` bloquea la edición de nombres.
  - `TanteadorTruco` muestra un encabezado "Torneo X · Ronda N" con un botón "Volver al torneo" (sale sin guardar).
  - `GameOverTrucoModal` recibe `labels` y acciones opcionales. En torneo, el botón pasa a ser
    "Guardar resultado". Ese botón llama a `useTorneoStore.getState().registrarResultado(partidoId, score1, score2, "anotador")`,
    después a `salirPartidoTorneo()`, y navega a `/truco/torneo`.
- La lógica de puntos (`addPoint`, el límite, el ganador) no se toca ni se copia.

## 2. Ubicación de los archivos nuevos
Se respeta la organización `components/<Juego>/{pages,…}`, con la lógica en stores y utilidades puras:
- `src/utils/torneo/`: motor puro, sin React ni Zustand y testeable con Jest.
  - `fixtureLiga.ts`: método del círculo, sorteo y equipo libre.
  - `llaveEliminacion.ts`: pases libres, avance e invalidación.
  - `tabla.ts`: posiciones y podio.
  - `validarCruces.ts`: validaciones del modo manual.
  - `tipos.ts`: modelo de datos.
  - Tests en `*.test.ts` al lado de cada archivo.
- `src/stores/useTorneoStore.ts`: persistido en `torneo-storage`, con `torneoActual` e `historial`.
- `src/validation/validation.ts`: se agregan los schemas `torneoNombreSchema`, `equipoNombreSchema` y `participanteNombreSchema`. La validación del resultado (`validarResultado`) quedó en `utils/torneo/partido.ts`, junto al resto del motor.
- `src/components/Truco/pages/`: `TorneoTrucoPage.tsx` y `NuevoTorneoTrucoPage.tsx`.
- `src/components/Truco/torneo/`: componentes del torneo (como `game/` y `displays/`).
  - `ConfigTorneoForm`, `EquiposAbm`, `CrucesManualesEditor`
  - `RondasLiga`, `LlaveEliminacion`, `PartidoCard`
  - `ResultadoManualModal`, `TablaPosiciones`, `Podio`, `HistorialTorneos`
- Rutas nuevas en `src/App.js`: `/truco/torneo` (torneo en curso, o la pantalla de inicio con historial)
  y `/truco/torneo/nuevo`. El partido sigue abriéndose en `/truco/anotador`.
- Accesos: se agrega "Torneo" a la sección Truco de `Layout/Drawer.tsx` y un CTA en `TrucoPage.tsx`.

## 3. Fases

### F1 — Modelo y store
- `utils/torneo/tipos.ts` define:
  - `Torneo`: id, nombre, formato, modoCruces, puntosPartida, jugadoresPorEquipo (`1 | 2 | 3`), estado (`configurando | en_curso | finalizado`), fecha,
    equipos, rondas, podio
  - `Equipo`: id, nombre, participantes
  - `Ronda`: numero, partidos, equipoLibre
  - `Partido`: id, equipoA, equipoB, tantosA, tantosB, ganador, estado (`pendiente | jugado | pase_libre`), origen (`anotador | manual`)
- `stores/useTorneoStore.ts` tiene:
  - `crearTorneo`, `agregarEquipo`, `editarEquipo`, `eliminarEquipo`, `iniciarTorneo`
  - `registrarResultado`, `corregirResultado`, `finalizarTorneo` (pasa el torneo al historial), `abandonarTorneo`
  - Reglas de la spec: no se puede iniciar con menos de 2 equipos, y con el torneo en curso no hay alta ni baja
    de equipos, solo edición de nombres. Los errores se muestran con el patrón `notify` de `useGameBritneyStore`.
  - Regla de jugadores por equipo (agregada durante F3): `agregarEquipo`/`editarEquipo` exigen exactamente
    `jugadoresPorEquipo` participantes, que no estén en otro equipo ni repetidos en el mismo. Con 1 jugador,
    el nombre del equipo vacío toma el del jugador. `actualizarConfig` permite cambiar la cantidad aunque haya
    equipos cargados, pero `iniciarTorneo` se niega mientras alguno no cumpla y los nombra en el aviso.
  - Participantes y nombres de equipo se comparan con `normalizarNombre` (`utils/torneo/equipos.ts`):
    trim, espacios internos colapsados y minúsculas.
  - `torneo-storage` pasa a `version: 1`; la migración completa `jugadoresPorEquipo = 2` en torneos guardados antes.
- `validation/validation.ts` agrega los schemas.

### F2 — Motor de cruces y tests
- `fixtureLiga.ts`: si el sorteo es automático, primero se mezcla el orden. Con un número impar de equipos se suma un
  "fantasma", y con el método del círculo cada equipo queda libre exactamente una vez. La liga es a una vuelta,
  así que salen n−1 rondas (n si es impar).
- `llaveEliminacion.ts`:
  - Si P es la potencia de 2 siguiente a n, hay P−n pases libres y (n−(P−n))/2 partidos en la 1ª ronda (ej.: 6 → 2 pases y 2 partidos).
  - `avanzar(rondas)` arma la ronda siguiente cuando se completa la actual.
  - `invalidarDesde(partidoId)` borra los resultados que dependían de ese partido.
- `tabla.ts`:
  - Cuenta PJ, PG, PP, TF, TC y DIF, ordenados por PG → DIF → TF.
  - Si sigue el empate, desempata por nombre para que el orden sea estable (supuesto).
  - Calcula el podio de liga (3 primeros) y el de eliminación (campeón, finalista y 3° según la regla acordada).
- `validarCruces.ts`: ningún equipo juega dos veces en la misma ronda.
  En la liga manual, además, que no se repita un cruce ya jugado.
- Tests: `utils/torneo/*.test.ts`.
  - Liga con 2 a 8 equipos: cada par juega una vez y cada equipo queda libre como máximo una vez.
  - Eliminación con 2, 3, 5, 6 y 8 equipos.
  - Tabla con desempates, podio con 2 y 3 equipos, e invalidación en cascada.

### F3 — Configuración y ABM de equipos
- `NuevoTorneoTrucoPage`, `ConfigTorneoForm` (nombre, 15/18/30, jugadores por equipo, formato, modo de cruces)
  y `EquiposAbm` (alta, edición y baja de equipos con participantes).
- `EquiposAbm` muestra un campo por jugador y deshabilita "Agregar equipo" hasta completarlos. Los equipos que
  no cumplen la cantidad se marcan en amarillo, y "Iniciar torneo" queda deshabilitado con un aviso.
  Al editar un equipo con jugadores de más no se descarta ninguno: se muestran todos, cada uno con un botón
  para quitarlo, con el aviso "Sobra(n) N jugador(es)", y "Guardar" queda deshabilitado hasta llegar a la cantidad.
- `CrucesManualesEditor` para el modo manual.
- Rutas en `App.js`, más los accesos en `Drawer.tsx` y `TrucoPage.tsx`.
- Supuestos del modo manual:
  - En liga se arma cada ronda a mano.
  - En eliminación se arma la 1ª ronda a mano (incluye quién tiene pase libre) y las siguientes salen de la llave.

### F4 — Fixture y resultados
- `TorneoTrucoPage` muestra las rondas: `RondasLiga` para liga y `LlaveEliminacion` para eliminación.
- `PartidoCard` tiene tres acciones: "Jugar en anotador", "Cargar a mano" y "Corregir".
- `ResultadoManualModal` valida que un equipo tenga exactamente `puntosPartida` y el otro menos.
- La corrección en eliminación usa `ConfirmationModal` e invalida en cascada.

### F5 — Integración con el anotador
- Cambios en `useGameTrucoStore.ts` (contexto de torneo, guardar y restaurar la partida libre),
  `TanteadorTruco.tsx`, `ConfigurationBar.tsx`, `PanelEquipo.tsx` y `GameOverTrucoModal.tsx`, según la sección 1.
- Incluye la corrección de los dos bugs (nombre del ganador y color por equipo).
- "Continuar partido en curso" en `TorneoTrucoPage` si `partidoTorneo` está activo.

### F6 — Tabla, llaves, podio e historial
- `TablaPosiciones` (liga), la vista final de `LlaveEliminacion` y `Podio` (1°, 2° y 3°), que aparece al finalizar.
- `HistorialTorneos` se muestra en `/truco/torneo` cuando no hay torneo en curso, con el podio de cada torneo terminado.
- La persistencia ya queda resuelta en F1. En esta fase se verifica que se pueda retomar el torneo al recargar.

## Verificación
- `npm install` (no hay `node_modules`).
- Motor: `CI=true npm test -- src/utils/torneo`. Se filtra por ruta porque `src/App.test.js` es el test por defecto
  de CRA y falla.
- Manual con `npm start`:
  1. Liga con 5 equipos: el fixture tiene 5 rondas y cada equipo queda libre una vez.
  2. Jugar un partido desde el anotador: el ganador y los tantos vuelven solos a la tabla.
  3. Cargar un resultado a mano y corregirlo.
  4. Empezar una partida libre, abrir un partido del torneo, volver al anotador libre: la partida libre se restauró.
  5. Eliminación con 6 equipos: hay 2 pases libres y 2 partidos. Corregir la semi después de jugada la final
     invalida la final. El podio respeta la regla del 3°.
  6. Recargar la página a mitad de un partido y del torneo: se retoma todo.
  7. Finalizar: el torneo aparece en el historial.
- `npm run build` sin errores de ESLint.
