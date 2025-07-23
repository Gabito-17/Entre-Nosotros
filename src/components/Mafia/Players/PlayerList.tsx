import { useEffect } from "react";
import { subscribeToPlayersInRoom } from "../../../services/gamesServices.ts";
import { useMafiaGame } from "../../../stores/useGameMafiaStore.ts";

export function PlayerList({ roomId }) {
  const players = useMafiaGame((state) => state.players);
  const setPlayers = useMafiaGame((state) => state.setPlayers);

  useEffect(() => {
    const unsubscribe = subscribeToPlayersInRoom(roomId, (payload) => {
      if (payload.eventType === "INSERT") {
        setPlayers((prevPlayers) => [...prevPlayers, payload.new]); // ✅ esto necesita una función actualizadora
      } else if (payload.eventType === "DELETE") {
        setPlayers((prevPlayers) =>
          prevPlayers.filter((j) => j.id !== payload.old.id)
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, setPlayers]);

  return (
    <div>
      <h2>Jugadores</h2>
      <ul>
        {players.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
