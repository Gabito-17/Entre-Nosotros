"use client";

import { useTorneoStore } from "../../../stores/useTorneoStore.ts";

type Props = {
  excluirId?: string;
};

const formatearFecha = (iso: string) => {
  const fecha = new Date(iso);
  return isNaN(fecha.getTime()) ? "" : fecha.toLocaleDateString("es-AR");
};

// Torneos terminados, del más reciente al más viejo, con su podio.
export default function HistorialTorneos({ excluirId }: Props) {
  const historial = useTorneoStore((s) => s.historial).filter((t) => t.id !== excluirId);
  if (historial.length === 0) return null;

  return (
    <section className="w-full max-w-2xl flex flex-col gap-3 text-left">
      <h2 className="text-xl font-bold text-secondary">Torneos anteriores</h2>
      {historial.map((t) => {
        const nombre = (id: string | null) => t.equipos.find((e) => e.id === id)?.nombre ?? "—";
        const puestos = [
          { n: 1, id: t.podio?.primero ?? null },
          { n: 2, id: t.podio?.segundo ?? null },
          { n: 3, id: t.podio?.tercero ?? null },
        ].filter((p) => p.id);
        return (
          <article key={t.id} className="card bg-base-100 shadow p-4 flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-bold text-lg break-words min-w-0">{t.nombre}</h3>
              <span className="text-xs text-base-content/60">{formatearFecha(t.fecha)}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="badge badge-secondary">{t.formato === "liga" ? "Liga" : "Eliminación"}</span>
              <span className="badge badge-outline">A {t.puntosPartida}</span>
              <span className="badge badge-outline">{t.equipos.length} equipos</span>
            </div>
            <ol className="flex flex-col gap-1">
              {puestos.map((p) => (
                <li key={p.n} className="flex gap-2 items-baseline">
                  <span className="font-bold w-6 shrink-0">{p.n}°</span>
                  <span className="break-words min-w-0">{nombre(p.id)}</span>
                </li>
              ))}
            </ol>
          </article>
        );
      })}
    </section>
  );
}
