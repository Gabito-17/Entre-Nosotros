"use client";

import { FormEvent, ReactNode, useState } from "react";
import { ConfigTorneo } from "../../../stores/useTorneoStore.ts";
import { Formato, JugadoresPorEquipo, ModoCruces, PuntosPartida } from "../../../utils/torneo/tipos.ts";

export const CONFIG_INICIAL: ConfigTorneo = {
  nombre: "",
  formato: "liga",
  modoCruces: "automatico",
  puntosPartida: 15,
  jugadoresPorEquipo: 2,
};

const FORMATOS: { valor: Formato; titulo: string; detalle: string }[] = [
  { valor: "liga", titulo: "Liga", detalle: "Todos contra todos. Gana quien encabeza la tabla." },
  { valor: "eliminacion", titulo: "Eliminación", detalle: "El que pierde queda afuera." },
];

const MODOS: { valor: ModoCruces; titulo: string; detalle: string }[] = [
  { valor: "automatico", titulo: "Sorteo", detalle: "La app arma los cruces." },
  { valor: "manual", titulo: "Manual", detalle: "Vos elegís quién juega contra quién." },
];

// Grupo de opciones tipo "tarjeta" (radio con estilo de botón)
function Opciones<T extends string | number>({
  nombre,
  opciones,
  valor,
  onChange,
}: {
  nombre: string;
  opciones: { valor: T; titulo: ReactNode; detalle?: string }[];
  valor: T;
  onChange: (valor: T) => void;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${opciones.length}, minmax(0, 1fr))` }}
    >
      {opciones.map((o) => (
        <label
          key={String(o.valor)}
          className={`btn h-auto min-h-12 py-2 flex-col gap-0 normal-case whitespace-normal ${
            valor === o.valor ? "btn-primary" : "btn-outline"
          }`}
        >
          <input
            type="radio"
            name={nombre}
            className="hidden"
            checked={valor === o.valor}
            onChange={() => onChange(o.valor)}
          />
          <span className="font-bold">{o.titulo}</span>
          {o.detalle && <span className="text-xs font-normal opacity-80">{o.detalle}</span>}
        </label>
      ))}
    </div>
  );
}

type Props = {
  inicial?: ConfigTorneo;
  textoBoton: string;
  // Devuelve true si se guardó (los errores los notifica el store)
  onGuardar: (config: ConfigTorneo) => boolean;
  onCancelar?: () => void;
};

export default function ConfigTorneoForm({ inicial = CONFIG_INICIAL, textoBoton, onGuardar, onCancelar }: Props) {
  const [config, setConfig] = useState<ConfigTorneo>(inicial);

  const cambiar = <K extends keyof ConfigTorneo>(campo: K, valor: ConfigTorneo[K]) =>
    setConfig((c) => ({ ...c, [campo]: valor }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onGuardar(config);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="form-control w-full">
        <span className="label-text font-semibold mb-1">Nombre del torneo</span>
        <input
          type="text"
          placeholder="Ej: Copa del asado"
          value={config.nombre}
          onChange={(e) => cambiar("nombre", e.target.value)}
          className="input input-bordered w-full"
          maxLength={30}
        />
      </label>

      <div>
        <span className="label-text font-semibold block mb-1">Puntos por partida</span>
        <Opciones<PuntosPartida>
          nombre="puntosPartida"
          opciones={[15, 18, 30].map((p) => ({ valor: p as PuntosPartida, titulo: `A ${p}` }))}
          valor={config.puntosPartida}
          onChange={(v) => cambiar("puntosPartida", v)}
        />
      </div>

      <div>
        <span className="label-text font-semibold block mb-1">Jugadores por equipo</span>
        <Opciones<JugadoresPorEquipo>
          nombre="jugadoresPorEquipo"
          opciones={[
            { valor: 1, titulo: "1", detalle: "Mano a mano" },
            { valor: 2, titulo: "2", detalle: "Parejas" },
            { valor: 3, titulo: "3", detalle: "Tríos" },
          ]}
          valor={config.jugadoresPorEquipo}
          onChange={(v) => cambiar("jugadoresPorEquipo", v)}
        />
      </div>

      <div>
        <span className="label-text font-semibold block mb-1">Formato</span>
        <Opciones<Formato>
          nombre="formato"
          opciones={FORMATOS}
          valor={config.formato}
          onChange={(v) => cambiar("formato", v)}
        />
      </div>

      <div>
        <span className="label-text font-semibold block mb-1">Armado de cruces</span>
        <Opciones<ModoCruces>
          nombre="modoCruces"
          opciones={MODOS}
          valor={config.modoCruces}
          onChange={(v) => cambiar("modoCruces", v)}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancelar && (
          <button type="button" className="btn btn-ghost" onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {textoBoton}
        </button>
      </div>
    </form>
  );
}
