# 🃏 Britney - Game Score Tracker

**Britney** es una aplicación web desarrollada con **React** para llevar el registro de partidas de juegos de mesa o cartas. Gestiona fácilmente jugadores, rondas, puntajes, descalificaciones y dealer. Todo desde una interfaz simple, rápida y persistente.

---

## 🚀 Características

- ✅ Registro dinámico de partidas por rondas
- ✅ Cálculo automático de puntajes acumulados
- ✅ Sistema de descalificación automática (por superar un umbral)
- ✅ Control rotativo del _dealer_
- ✅ Historial de rondas jugadas
- ✅ Persistencia automática con `localStorage`
- ✅ Interfaz moderna con **DaisyUI**
- ✅ Modales reutilizables y componentes visuales desacoplados
- ✅ Validaciones robustas de puntajes usando **Zod**
- ✅ Notificaciones tipo _toast_ con `zustand` y DaisyUI

---

## 🧠 Mejoras recientes

### 📦 Zustand como gestor de estado

Se implementó Zustand para manejar:

- La sesión de juego (`useGameSessionStore`)
- El estado general de UI (`useUiStore`)
- Las notificaciones visuales (`useUiNotificationStore`)

Esto mejora la organización y escalabilidad del código.

### 🔔 Sistema de notificaciones tipo Toast

Se agregó un sistema de notificaciones visuales usando `zustand` y componentes de **DaisyUI**. Estas notificaciones:

- Aparecen automáticamente al validar errores o acciones importantes
- Se auto-cierran a los 4 segundos
- Son totalmente personalizables por tipo (`success`, `error`, `info`, `warning`)

### 🔧 Correcciones y mejoras generales

- Validaciones de nombres y puntajes con Zod
- Prevención de nombres duplicados
- Lógica de `-10` limitada a un jugador por ronda
- Dealer ignora a jugadores descalificados
- Refactor para separar hooks, stores y lógica de negocio
- Estilos UI mejorados con DaisyUI y Heroicons

---

## 🧱 Estructura del proyecto

```
/src
  /assets        → imagenes y assets necesarios.
  /components        → Componentes reutilizables (modales, botones, etc.)
  /pages             → Página principal
  /stores            → Estados globales con Zustand
  /validation        → Esquemas de validación con Zod

```

---

## ⚙️ Tecnologías utilizadas

- React (con Hooks y JSX)
- Zustand (estado global)
- Tailwind CSS + DaisyUI (estilo UI)
- Heroicons (iconografía SVG)
- Zod (validaciones de esquema)
- localStorage API (persistencia del juego)

---

## 🧪 Instalación

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
npm run start
```

La aplicación estará disponible en:  
📍 http://localhost:3000

---

## 🔮 Roadmap / Próximas mejoras

- 🎲 Soporte para diferentes tipos de juegos
- 💾 Exportación e importación de partidas (JSON)
- ☁️ Sincronización online con backend
- 📱 Mejora de la experiencia en móviles
- 🎨 Temas visuales personalizables
- 🧪 Tests unitarios para lógica y componentes

---

## 📄 Licencia

Proyecto educativo y personal.  
Actualmente sin licencia comercial.  
Desarrollado con 💙 para ayudarte a disfrutar tus partidas sin perder el hilo.

---
