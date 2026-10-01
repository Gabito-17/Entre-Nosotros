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
  - `RondasLiga`, `LlaveEliminacion`, `PartidoCard`, `RondaDesplegable` (ronda plegable compartida)
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

### F4 — Fixture y resultados (hecha)
- `TorneoTrucoPage` muestra las rondas: `RondasLiga` para liga y `LlaveEliminacion` para eliminación.
  Las dos usan `RondaDesplegable`: cada ronda es plegable, con un contador de jugados (ej. 1/2), y solo
  queda abierta la primera ronda con partidos pendientes. Arriba hay una barra de progreso
  (partidos jugados sobre n·(n−1)/2 en liga, o sobre n − 1 en eliminación).
- `PartidoCard` muestra los equipos uno debajo del otro, para que entren nombres largos en el celular,
  con los tantos y una tilde en el ganador. Tiene tres acciones:
  - "Anotador" abre el partido en el anotador (F5); queda deshabilitado mientras no se conocen los dos equipos.
  - "Cargar a mano" se deshabilita mientras no se conocen los dos equipos.
  - "Corregir" aparece cuando el partido ya se jugó.
- `ResultadoManualModal` es una hoja inferior en el celular y un modal centrado en pantallas grandes:
  - Cada equipo tiene un botón "Ganó" que le pone `puntosPartida`, y un campo numérico (`inputMode="numeric"`, solo dígitos).
  - Valida mientras se escribe con `validarResultado`, que ahora también avisa "Nadie puede pasarse de N tantos".
  - "Guardar" queda deshabilitado mientras el resultado sea inválido o, al corregir, sea igual al que ya estaba.
- Corrección en eliminación: si `partidosAfectadosPorCorreccion` devuelve partidos, el mismo modal pasa a un
  paso de confirmación ("Cambia el ganador") con la lista de resultados que se borran (ej. "Final: A 15 – 14 B"),
  y ofrece "Volver" o "Corregir igual". Se hace dentro del modal y no con `ConfirmationModal`, para que
  "Volver" no pierda el marcador que se estaba cargando. En liga se corrige sin ese paso, porque ningún
  otro partido depende del resultado.
- `LlaveEliminacion` nombra las rondas según sus partidos (`nombreRondaEliminacion`: Final, Semifinales,
  Cuartos, Octavos; si no, "Ronda N"). Muestra bloqueadas las rondas que todavía no se armaron
  (`totalRondasEliminacion`) y avisa cuando se jugó la final. El podio queda para F6.

#### Liga manual: cuántas rondas faltan y cuándo termina
- La cantidad de rondas no es fija (depende de cómo se arme cada una), pero la de cruces sí: n·(n−1)/2.
  `estadoCrucesLiga` (en `fixtureLiga.ts`) devuelve:
  - `total` y `jugados`.
  - `sinArmar`: los cruces que no están en ninguna ronda.
  - `rondasMinimas`: una cota inferior, max(rivales pendientes del equipo más atrasado, ⌈sinArmar / ⌊n/2⌋⌉).
    Se muestra como "Faltan N cruces por armar · al menos M rondas más".
- La liga termina cuando `ligaCompleta` da true: todos los pares están en el fixture y no queda nada pendiente.
  No se puede trabar, porque cualquier par que falte siempre puede formar una ronda. Se muestra
  "¡Ya jugaron todos contra todos!". El botón "Finalizar" queda para F6.
- "Cruces por jugar (N)" (plegable) lista, por equipo, los rivales sin resultado, y marca en qué ronda
  están si ya se armaron.
- Decisiones tomadas con el usuario:
  - Se permiten rondas incompletas. El editor solo avisa qué equipos que se deben un partido quedan sin jugar.
  - **Liga manual:** la próxima ronda se arma solo cuando termina la actual. `agregarRondaManual` lo exige en el store
    y "Armar ronda N" queda deshabilitado con la cantidad de resultados que faltan.
  - **Liga con sorteo:** se pueden cargar resultados de cualquier ronda (una mesa libre adelanta un partido).
- `CrucesManualesEditor` en liga:
  - Deshabilita a los equipos que ya jugaron con todos los que quedan sin asignar, y lo explica en texto
    (en el celular no hay tooltips).
  - Sigue deshabilitando los rivales repetidos.
  - El mensaje de "Cruces listos" dice cuántos cruces quedan después de esa ronda.
- Deshacer: `quitarUltimaRonda` (solo liga manual) borra la última ronda si ninguno de sus partidos tiene resultado.
  La UI pide confirmación, y el botón queda deshabilitado con el motivo si ya hay resultados.
- `claveCruce` pasó a `partido.ts` y la comparten el motor y el editor.

### F5 — Integración con el anotador (hecha)
- `useGameTrucoStore` suma `partidoTorneo`, `partidaLibreGuardada`, `iniciarPartidoTorneo` y `salirPartidoTorneo`
  (persistidos). Si ya hay un partido de torneo abierto, `iniciarPartidoTorneo` no pisa la partida libre guardada.
  La lógica de puntos no se tocó.
- `TanteadorTruco`: en modo torneo muestra el encabezado "Torneo · Ronda N" (en eliminación, el nombre de la
  etapa) con "Volver al torneo" (sale sin guardar). El modal de fin usa los nombres reales del ganador (bug 1)
  y su botón pasa a "Guardar resultado": `registrarResultado(..., "anotador")`, `salirPartidoTorneo()` y
  navegación a `/truco/torneo`. Si el registro falla, el partido sigue abierto.
- Un contexto viejo (torneo abandonado, o partido que ya se cargó a mano) se limpia solo al abrir el anotador,
  y "Abandonar torneo" también restaura la partida libre.
- `ConfigurationBar` bloquea el selector 15/18/30 y `PanelEquipo` oculta la edición de nombres en torneo.
  El color de `PanelEquipo` depende de `equipo === "equipo1"` (bug 2).
- `PartidoCard` habilita "Anotador" (`onAnotador`, pasado por `RondaDesplegable`, `RondasLiga` y `LlaveEliminacion`).
- `TorneoTrucoPage`: aviso "Continuar partido en curso" con el marcador si hay un partido pendiente abierto.
  Abrir otro partido con tantos cargados pide confirmación, porque se pierde el avance del anterior.
- El modal de fin en torneo tiene "Seguir anotando": cierra sin guardar ni reiniciar, para restar un punto
  sumado por error. Si el marcador deja de tener ganador el partido sigue normal, y si vuelve a haber ganador
  el modal se reabre solo. Si se cierra y el marcador sigue con ganador, aparece el botón
  "Terminó el partido · Guardar resultado" para reabrirlo (si no, no habría forma de guardar).
- Tests: `stores/useGameTrucoStore.test.ts` (9) cubre guardar y restaurar la partida libre, no pisarla al
  cambiar de partido, el contexto viejo sin partida guardada, e idempotencia de `salirPartidoTorneo`. También
  cubre la persistencia en `truco-config` y el retome tras rehidratar. La limpieza del contexto viejo que hace
  `TanteadorTruco` (torneo abandonado o partido ya jugado) es del componente y no tiene test automático.

### F6 — Tabla, podio e historial (hecha)
- `TablaPosiciones` (liga, arriba de las rondas): usa `calcularTabla`. En el celular no hay scroll horizontal:
  columnas #, Equipo, PJ, PG, PP y DIF, con TF/TC debajo del nombre; desde `sm` TF y TC son columnas propias.
- "Finalizar torneo" (`TorneoTrucoPage`): se habilita con `estaCompleto()` (liga completa o final jugada) y,
  deshabilitado, explica por qué. Pide confirmación mostrando quién ganó y avisa que después no se corrige nada.
  Al confirmar libera el contexto del anotador si había uno abierto y pasa el torneo al historial.
- `Podio` (2°-1°-3°, nombres largos con salto de línea, con los jugadores si el equipo tiene más de uno).
  Con 2 equipos no hay 3°: se omite el puesto y se aclara. Se muestra apenas se finaliza, en la pantalla de inicio.
- `HistorialTorneos` en `/truco/torneo` sin torneo en curso (también con uno en preparación): nombre, fecha, formato,
  puntos, cantidad de equipos y podio de cada torneo terminado, del más nuevo al más viejo.
- Retomar al recargar: tests de rehidratación en `useTorneoStore.test.ts` para torneo configurando, liga a mitad,
  eliminación tras una corrección y finalizado, más "no se finaliza dos veces ni se corrige después de finalizar".
- Notas: en liga, si siguen empatados PG/DIF/TF el podio desempata por nombre (supuesto de F2). `LlaveEliminacion`
  se dejó como está: ya muestra las llaves por ronda y el aviso de final; el podio se ve al finalizar.
- Sin test automático: los componentes (`TablaPosiciones`, `Podio`, `HistorialTorneos`, flujo de finalizar).
- `npm run build` con `CI=true` falla por warnings de ESLint que ya existían y no son del torneo
  (`App.js`: `PlayerProvider`/`UserProvider`; `ProfileSettings.tsx`: `newAvatarUrl`).

## Verificación
- `npm install` (no hay `node_modules`).
- Motor y stores: `CI=true npm test -- src/utils/torneo src/stores`. Se filtra por ruta porque `src/App.test.js` es el test por defecto
  de CRA y falla.
- Manual con `npm start`:
  1. Liga con 5 equipos: el fixture tiene 5 rondas y cada equipo queda libre una vez.
  2. Jugar un partido desde el anotador: el ganador y los tantos vuelven solos a la tabla.
  3. Cargar un resultado a mano y corregirlo. Liga manual con 4 equipos: "Armar ronda 2" se habilita recién al
     terminar la ronda 1, el editor no deja repetir cruces y al final aparece "¡Ya jugaron todos contra todos!".
  4. Empezar una partida libre, abrir un partido del torneo, volver al anotador libre: la partida libre se restauró.
  5. Eliminación con 6 equipos: hay 2 pases libres y 2 partidos. Corregir la semi después de jugada la final
     invalida la final. El podio respeta la regla del 3°.
  6. Recargar la página a mitad de un partido y del torneo: se retoma todo.
  7. Finalizar: el torneo aparece en el historial.
- `npm run build` sin errores de ESLint.
