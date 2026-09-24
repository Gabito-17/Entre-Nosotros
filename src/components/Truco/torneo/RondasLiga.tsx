"use client";

import {
  ArrowUturnLeftIcon,
  CheckIcon,
  PlusIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useTorneoStore } from "../../../stores/useTorneoStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";
import { estadoCrucesLiga, ligaCompleta } from "../../../utils/torneo/fixtureLiga.ts";
import { claveCruce } from "../../../utils/torneo/partido.ts";
import { Partido, Torneo } from "../../../utils/torneo/tipos.ts";
import CrucesManualesEditor, {
  errorSeleccion,
  SELECCION_VACIA,
  SeleccionCruces,
} from "./CrucesManualesEditor.tsx";
import RondaDesplegable from "./RondaDesplegable.tsx";

type Props = {
  torneo: Torneo;
  nombre: (id: string | null) => string;
  onCargar: (partido: Partido, contexto: string) => void;
  onCorregir: (partido: Partido, contexto: string) => void;
};

const plural = (n: number, singular: string, varios: string) => `${n} ${n === 1 ? singular : varios}`;

// Rivales que le faltan a cada equipo (sin resultado), con la ronda si ya está armado.
function CrucesPorJugar({ torneo }: { torneo: Torneo }) {
  const partidos = torneo.rondas.flatMap((r) => r.partidos.map((p) => ({ ...p, ronda: r.numero })));
  const jugados = new Set(
    partidos.filter((p) => p.estado === "jugado").map((p) => claveCruce(p.equipoA, p.equipoB))
  );
  const rondaArmada = new Map(partidos.map((p) => [claveCruce(p.equipoA, p.equipoB), p.ronda]));

  const porEquipo = torneo.equipos
    .map((e) => ({
      equipo: e,
      rivales: torneo.equipos.filter(
        (o) => o.id !== e.id && !jugados.has(claveCruce(e.id, o.id))
      ),
    }))
    .filter(({ rivales }) => rivales.length > 0);

  const total = (torneo.equipos.length * (torneo.equipos.length - 1)) / 2 - jugados.size;
  if (total === 0) return null;

  return (
    <details className="collapse collapse-arrow border border-base-300">
      <summary className="collapse-title font-semibold min-h-0 py-3">
        Cruces por jugar ({total})
      </summary>
      <ul className="collapse-content flex flex-col gap-2 text-sm">
        {porEquipo.map(({ equipo, rivales }) => (
          <li key={equipo.id}>
            <span className="font-semibold">{equipo.nombre}:</span>{" "}
            {rivales.map((o, i) => {
              const ronda = rondaArmada.get(claveCruce(equipo.id, o.id));
              return (
                <span key={o.id}>
                  {i > 0 && ", "}
                  vs {o.nombre}
                  {ronda !== undefined && (
                    <span className="text-base-content/50"> (ronda {ronda})</span>
                  )}
                </span>
              );
            })}
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function RondasLiga({ torneo, nombre, onCargar, onCorregir }: Props) {
  const agregarRondaManual = useTorneoStore((s) => s.agregarRondaManual);
  const quitarUltimaRonda = useTorneoStore((s) => s.quitarUltimaRonda);
  const openConfirmationModal = useUiStore((s) => s.openConfirmationModal);

  const [armando, setArmando] = useState(false);
  const [seleccion, setSeleccion] = useState<SeleccionCruces>(SELECCION_VACIA);

  const ids = torneo.equipos.map((e) => e.id);
  const { total, jugados, sinArmar, rondasMinimas } = estadoCrucesLiga(ids, torneo.rondas);
  const completa = ligaCompleta(torneo.rondas, ids.length);
  const manual = torneo.modoCruces === "manual";

  const ultima = torneo.rondas[torneo.rondas.length - 1];
  const pendientesUltima = ultima?.partidos.filter((p) => p.estado === "pendiente").length ?? 0;
  const ultimaConResultados = !!ultima?.partidos.some((p) => p.estado === "jugado");
  const numeroSiguiente = torneo.rondas.length + 1;

  // Abierta: la primera ronda con partidos pendientes (con sorteo se puede
  // adelantar cualquiera, pero se sigue el orden del fixture).
  const rondaActual = torneo.rondas.find((r) => r.partidos.some((p) => p.estado === "pendiente"));

  const confirmarRonda = () => {
    if (agregarRondaManual(seleccion.cruces)) {
      setArmando(false);
      setSeleccion(SELECCION_VACIA);
    }
  };

  const handleDeshacer = () => {
    if (!ultima) return;
    openConfirmationModal({
      title: `¿Deshacer la ronda ${ultima.numero}?`,
      message: "Se borran sus cruces para que la armes de nuevo. No tiene resultados cargados.",
      onConfirm: quitarUltimaRonda,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Progreso */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span>{plural(jugados, "partido jugado", "partidos jugados")}</span>
          <span className="text-base-content/60">de {total}</span>
        </div>
        <progress className="progress progress-primary w-full" value={jugados} max={total} />
        {manual && sinArmar.length > 0 && (
          <p className="text-sm text-base-content/70">
            Faltan {plural(sinArmar.length, "cruce", "cruces")} por armar · al menos{" "}
            {plural(rondasMinimas, "ronda más", "rondas más")}
          </p>
        )}
      </div>

      {completa && (
        <div role="alert" className="alert alert-success">
          <SparklesIcon className="h-6 w-6" />
          <span>
            <b>¡Ya jugaron todos contra todos!</b> Revisá los resultados antes de cerrar el torneo.
          </span>
        </div>
      )}

      <CrucesPorJugar torneo={torneo} />

      {torneo.rondas.map((ronda) => {
        const esUltimaManual = manual && ronda === ultima;
        return (
          <RondaDesplegable
            key={ronda.numero}
            titulo={`Ronda ${ronda.numero}`}
            ronda={ronda}
            abierta={ronda === rondaActual}
            nombre={nombre}
            onCargar={onCargar}
            onCorregir={onCorregir}
          >
            {ronda.equipoLibre && (
              <p className="text-sm text-base-content/60 px-1">
                Libre: <b>{nombre(ronda.equipoLibre)}</b>
              </p>
            )}
            {esUltimaManual && (
              <div className="flex flex-col items-start gap-1">
                <button
                  className="btn btn-sm btn-ghost text-error"
                  onClick={handleDeshacer}
                  disabled={ultimaConResultados}
                >
                  <ArrowUturnLeftIcon className="h-4 w-4" /> Deshacer ronda
                </button>
                {ultimaConResultados && (
                  <span className="text-xs text-base-content/60 px-1">
                    Tiene resultados cargados: corregilos en vez de deshacer la ronda.
                  </span>
                )}
              </div>
            )}
          </RondaDesplegable>
        );
      })}

      {/* Liga manual: la próxima ronda se arma cuando termina la actual */}
      {manual && sinArmar.length > 0 && (
        <section className="rounded-box border border-dashed border-base-300 p-3 flex flex-col gap-3">
          {armando ? (
            <>
              <h3 className="font-semibold">Ronda {numeroSiguiente}</h3>
              <CrucesManualesEditor
                equipos={torneo.equipos}
                formato="liga"
                seleccion={seleccion}
                onChange={setSeleccion}
                rondasPrevias={torneo.rondas}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setArmando(false);
                    setSeleccion(SELECCION_VACIA);
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={confirmarRonda}
                  disabled={errorSeleccion("liga", seleccion, ids, torneo.rondas) !== null}
                >
                  <CheckIcon className="h-5 w-5" /> Confirmar ronda
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={() => setArmando(true)}
                disabled={pendientesUltima > 0}
              >
                <PlusIcon className="h-5 w-5" /> Armar ronda {numeroSiguiente}
              </button>
              {pendientesUltima > 0 && (
                <p className="text-sm text-center text-base-content/60">
                  Terminá la ronda {ultima.numero} para armar la próxima (
                  {pendientesUltima === 1 ? "falta 1 resultado" : `faltan ${pendientesUltima} resultados`}).
                </p>
              )}
            </>
          )}
        </section>
      )}

      {manual && sinArmar.length === 0 && !completa && (
        <p className="text-sm text-center text-base-content/60">
          Ya están armados todos los cruces. Falta cargar los resultados pendientes.
        </p>
      )}
    </div>
  );
}
