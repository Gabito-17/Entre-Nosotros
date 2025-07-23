import React from "react";

type Player = {
  id: string;
  name: string;
  isHost: boolean;
};

type PlayerListProps = {
  players: Player[];
};

export const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <ul className="bg-white rounded-lg shadow-md p-4 text-left space-y-2">
      {players.map((p) => (
        <li
          key={p.id}
          className="flex justify-between items-center border-b pb-1"
        >
          <span>{p.name || p.id}</span>
          {p.isHost && (
            <span className="text-xs text-green-600 font-semibold">Host</span>
          )}
        </li>
      ))}
    </ul>
  );
};