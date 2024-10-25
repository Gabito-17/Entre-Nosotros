// Función para avanzar al próximo dealer
const advanceDealer = () => {
  setCurrentDealerIndex((prevIndex) => {
    let nextIndex = (prevIndex + 1) % players.length;

    // Encuentra el próximo dealer válido
    while (disqualifiedPlayers.includes(players[nextIndex].name)) {
      nextIndex = (nextIndex + 1) % players.length;
      // Si todos los jugadores están descalificados, podría ser útil manejar esto con un estado adicional
      if (nextIndex === prevIndex) {
        console.warn("Todos los jugadores están descalificados.");
        return -1; // Indica que no hay dealer válido
      }
    }

    return nextIndex; // Retorna el índice del nuevo dealer válido
  });
};
