# Britney - Game Score Tracker

Britney es una aplicación web desarrollada en React que permite registrar partidas de juegos de mesa o cartas, gestionando rondas, puntajes, descalificaciones y jugadores de manera sencilla e intuitiva.

## Características

- Registro de partidas por rondas
- Cálculo automático de puntajes acumulados
- Soporte para descalificaciones de jugadores
- Control de dealer/turno
- Historial completo de partidas
- Soporte para múltiples partidas activas
- Persistencia de datos en el navegador mediante `localStorage`
- Modales y componentes reutilizables con React y Tailwind CSS
- Hooks personalizados para encapsular la lógica de juego
- Validaciones de puntaje mediante Zod

## Tecnologías utilizadas

- React (con Hooks y componentes funcionales)
- Tailwind CSS (para el diseño UI)
- Heroicons (iconos SVG)
- Zod (validaciones de datos)
- localStorage API (persistencia en el navegador)

## Estructura del proyecto

```
/src
  /components     -> Componentes de UI reutilizables (modales, botones, inputs, etc)
  /hooks          -> Hooks personalizados (useGame, useRound, usePlayers, etc)
  /types          -> Tipos de datos y estructuras utilizadas
  /utils          -> Utilidades y funciones auxiliares
  /storage        -> Encapsulación de acceso a localStorage
  /pages          -> Entrada principal de la app
```

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/britney.git
cd britney
```

2. Instalar dependencias:

```bash
npm install
# o
pnpm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Pendientes / Roadmap

- Agregar soporte para distintos tipos de juego con reglas personalizadas
- Exportar e importar partidas (JSON)
- Integración futura con backend para sincronización online
- Soporte multi-dispositivo
- Mejora de UX y temas visuales

## Licencia

Proyecto educativo y personal. Sin licencia comercial por el momento.
