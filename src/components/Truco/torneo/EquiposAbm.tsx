"use client";

import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { fadeItem } from "../../../lib/Animations.ts";
import { DatosEquipo, useTorneoStore } from "../../../stores/useTorneoStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";
import { cumpleJugadores } from "../../../utils/torneo/equipos.ts";
import { Equipo, JugadoresPorEquipo } from "../../../utils/torneo/tipos.ts";

// Clases completas para que Tailwind las detecte
const COLUMNAS: Record<JugadoresPorEquipo, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

// Arma al menos n casilleros con los participantes que ya tenía el equipo.
// Si tenía de más no se descarta ninguno: el usuario elige a quién quitar.
const casilleros = (participantes: string[], n: number) =>
  Array.from({ length: Math.max(n, participantes.length) }, (_, i) => participantes[i] ?? "");

// Formulario de alta/edición: nombre del equipo y un campo por jugador.
// Con 1 jugador por equipo el nombre es opcional (por defecto, el del jugador).
function EquipoForm({
  jugadores,
  inicial,
  textoBoton,
  onGuardar,
  onCancelar,
}: {
  jugadores: JugadoresPorEquipo;
  inicial?: DatosEquipo;
  textoBoton: string;
  onGuardar: (datos: DatosEquipo) => boolean;
  onCancelar?: () => void;
}) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [participantes, setParticipantes] = useState(() =>
    casilleros(inicial?.participantes ?? [], jugadores)
  );

  const nombreOpcional = jugadores === 1;
  const sobran = participantes.length - jugadores;
  const completo =
    sobran === 0 &&
    participantes.every((p) => p.trim() !== "") &&
    (nombreOpcional || nombre.trim() !== "");

  const quitarParticipante = (i: number) =>
    setParticipantes((ps) => ps.filter((_, j) => j !== i));

  const cambiarParticipante = (i: number, valor: string) =>
    setParticipantes((ps) => ps.map((p, j) => (j === i ? valor : p)));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!completo) return;
    if (onGuardar({ nombre, participantes }) && !inicial) {
      setNombre("");
      setParticipantes(casilleros([], jugadores));
    }
  };

  const inputNombre = (
    <input
      type="text"
      placeholder={nombreOpcional ? "Nombre del equipo (opcional)" : "Nombre del equipo"}
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
      className="input input-bordered input-sm w-full"
      maxLength={20}
    />
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {!nombreOpcional && inputNombre}

      {/* Con jugadores de más: uno por fila, cada uno con su botón para quitarlo */}
      <div className={`grid gap-2 ${sobran > 0 ? "" : COLUMNAS[jugadores]}`}>
        {participantes.map((p, i) => (
          <div key={i} className="join w-full">
            <input
              type="text"
              placeholder={jugadores === 1 ? "Nombre del jugador" : `Jugador ${i + 1}`}
              value={p}
              onChange={(e) => cambiarParticipante(i, e.target.value)}
              className="input input-bordered input-sm join-item flex-1 min-w-0"
              maxLength={20}
            />
            {sobran > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-outline btn-error join-item"
                onClick={() => quitarParticipante(i)}
                aria-label={`Quitar a ${p || `jugador ${i + 1}`}`}
                title="Quitar jugador"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {sobran > 0 && (
        <p role="alert" className="text-sm text-warning flex items-center gap-1">
          <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
          {sobran === 1 ? "Sobra 1 jugador" : `Sobran ${sobran} jugadores`}. Quitá{" "}
          {sobran === 1 ? "uno" : sobran} para poder guardar.
        </p>
      )}

      {nombreOpcional && inputNombre}

      <div className="flex gap-2 justify-end">
        {onCancelar && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-sm btn-primary" disabled={!completo}>
          {textoBoton}
        </button>
      </div>
    </form>
  );
}

type Props = {
  equipos: Equipo[];
  jugadoresPorEquipo: JugadoresPorEquipo;
  // Con el torneo iniciado solo se pueden editar nombres
  bloqueado?: boolean;
};

export default function EquiposAbm({ equipos, jugadoresPorEquipo, bloqueado = false }: Props) {
  const agregarEquipo = useTorneoStore((s) => s.agregarEquipo);
  const editarEquipo = useTorneoStore((s) => s.editarEquipo);
  const eliminarEquipo = useTorneoStore((s) => s.eliminarEquipo);
  const openConfirmationModal = useUiStore((s) => s.openConfirmationModal);

  const [editandoId, setEditandoId] = useState<string | null>(null);

  const handleEliminar = (equipo: Equipo) => {
    openConfirmationModal({
      title: "¿Eliminar equipo?",
      message: `Se va a quitar a "${equipo.nombre}" del torneo.`,
      onConfirm: () => eliminarEquipo(equipo.id),
    });
  };

  const handleEditar = (id: string, datos: DatosEquipo) => {
    const ok = editarEquipo(id, datos);
    if (ok) setEditandoId(null);
    return ok;
  };

  return (
    <div className="flex flex-col gap-4">
      {!bloqueado && (
        <div className="card bg-base-200 p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <PlusIcon className="h-5 w-5" /> Nuevo equipo
          </h3>
          {/* key: si cambia la cantidad de jugadores, el formulario se rearma */}
          <EquipoForm
            key={jugadoresPorEquipo}
            jugadores={jugadoresPorEquipo}
            textoBoton="Agregar equipo"
            onGuardar={agregarEquipo}
          />
        </div>
      )}

      {equipos.length === 0 ? (
        <p className="text-center text-base-content/60">Todavía no hay equipos cargados.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {equipos.map((equipo, i) => {
              const cumple = cumpleJugadores(equipo, jugadoresPorEquipo);
              return (
                <motion.li
                  key={equipo.id}
                  layout
                  variants={fadeItem}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: 40 }}
                  className={`card bg-base-100 border p-3 ${cumple ? "border-base-300" : "border-warning"}`}
                >
                  {editandoId === equipo.id ? (
                    <EquipoForm
                      jugadores={jugadoresPorEquipo}
                      inicial={equipo}
                      textoBoton="Guardar"
                      onGuardar={(datos) => handleEditar(equipo.id, datos)}
                      onCancelar={() => setEditandoId(null)}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary badge-outline">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{equipo.nombre}</p>
                        {equipo.participantes.length > 0 && (
                          <p className="text-sm text-base-content/70 truncate">
                            {equipo.participantes.join(", ")}
                          </p>
                        )}
                        {!cumple && (
                          <p className="text-xs text-warning flex items-center gap-1 mt-1">
                            <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
                            Tiene {equipo.participantes.length} de {jugadoresPorEquipo}{" "}
                            {jugadoresPorEquipo === 1 ? "jugador" : "jugadores"}. Editalo para corregirlo.
                          </p>
                        )}
                      </div>
                      <button
                        className={`btn btn-sm btn-square ${cumple ? "btn-ghost" : "btn-warning"}`}
                        onClick={() => setEditandoId(equipo.id)}
                        title="Editar equipo"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {!bloqueado && (
                        <button
                          className="btn btn-sm btn-ghost btn-square text-error"
                          onClick={() => handleEliminar(equipo)}
                          title="Eliminar equipo"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      {!bloqueado && equipos.length < 2 && (
        <p className="text-sm text-center text-base-content/60 flex items-center justify-center gap-1">
          <InformationCircleIcon className="h-4 w-4" /> Se necesitan al menos 2 equipos para iniciar.
        </p>
      )}
    </div>
  );
}
