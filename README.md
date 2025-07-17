
# 🃏 Britney - Game Score Tracker (ahora "Entre Nosotros")

**Entre Nosotros** es una aplicación web desarrollada con **React** para llevar el registro de partidas de juegos de mesa o cartas. Gestiona fácilmente jugadores, rondas, puntajes, descalificaciones y dealer, ahora con soporte para **múltiples juegos** como partidas personalizadas, **Britney** y **Truco argentino**. Todo desde una interfaz simple, rápida y persistente.

---

🚀 Características

- ✅ Soporte para Truco y Britney
- ✅ Registro dinámico de partidas por rondas
- ✅ Cálculo automático de puntajes acumulados
- ✅ Sistema de descalificación automática (por superar un umbral)
- ✅ Control rotativo del dealer
- ✅ Historial de rondas jugadas
- ✅ Persistencia automática con `localStorage`
- ✅ Interfaz moderna con DaisyUI
- ✅ Modales reutilizables y componentes visuales desacoplados
- ✅ Validaciones robustas de puntajes usando Zod
- ✅ Notificaciones tipo toast con `zustand` y DaisyUI

---

🧠 Mejoras recientes

🎮 Soporte para el juego Truco Argentino

- Puntaje máximo configurable (15, 30)
- Estilos visuales clásicos como representación de fósforos
- Manejo de equipos, nombres personalizados y rotación de mano

📦 Zustand como gestor de estado

- `useGameSessionStore`, `useGameTruco`, `useUiStore`, `useUiNotificationStore`
- Organización y escalabilidad mejorada

🔔 Sistema de notificaciones tipo Toast

- Aparecen automáticamente al validar errores o acciones importantes
- Se auto-cierran a los 4 segundos
- Personalizables por tipo (success, error, info, warning)

🔧 Correcciones y mejoras generales

- Validaciones de nombres y puntajes con Zod
- Prevención de nombres duplicados
- Lógica de `-10` limitada a un jugador por ronda
- Dealer ignora a jugadores descalificados
- Refactor para separar hooks, stores y lógica
- Estilos UI mejorados

---

⚙️ Tecnologías utilizadas

- React (con Hooks y JSX)
- Zustand (estado global)
- Tailwind CSS + DaisyUI
- Heroicons (iconografía SVG)
- Zod (validaciones)
- localStorage API

---

🧪 Instalación

1. Clonar el repositorio:

git clone https://github.com/tu-usuario/entrenosotros.git
cd entrenosotros

2. Instalar dependencias:

npm install
# o
pnpm install

3. Iniciar servidor:

npm run start

📍 Disponible en: http://localhost:3000

---

🔮 Roadmap / Próximas mejoras

- Agregar nuevos tipos de juegos compatibles
- Mejora de experiencia en móviles
- Temas visuales personalizables

---

📄 Licencia

Proyecto educativo y personal.
Actualmente sin licencia comercial.
Desarrollado con 💙 para ayudarte a disfrutar tus partidas sin perder el hilo.


ADICION DE SUPABASE