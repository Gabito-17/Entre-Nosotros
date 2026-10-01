"use client";

import { calcularTabla } from "../../../utils/torneo/tabla.ts";
import { Equipo, Ronda } from "../../../utils/torneo/tipos.ts";

type Props = {
  equipos: Equipo[];
  rondas: Ronda[];
};

const dif = (n: number) => (n > 0 ? `+${n}` : `${n}`);

// Tabla de liga. En el celular no hay scroll horizontal: se muestran PJ, PG,
// PP y DIF, y los tantos a favor y en contra van debajo del nombre. Desde
// `sm` aparecen como columnas propias.
export default function TablaPosiciones({ equipos, rondas }: Props) {
  const tabla = calcularTabla(equipos, rondas);
  const huboPartidos = tabla.some((f) => f.pj > 0);

  return (
    <div className="flex flex-col gap-2">
      <table className="table table-fixed w-full text-xs sm:text-sm [&_th]:px-1 [&_td]:px-1 sm:[&_th]:px-3 sm:[&_td]:px-3">
        <thead>
          <tr>
            <th className="w-7 sm:w-10">#</th>
            <th>Equipo</th>
            <th className="w-8 sm:w-12 text-center" title="Partidos jugados">PJ</th>
            <th className="w-8 sm:w-12 text-center" title="Partidos ganados">PG</th>
            <th className="w-8 sm:w-12 text-center" title="Partidos perdidos">PP</th>
            <th className="hidden sm:table-cell w-12 text-center" title="Tantos a favor">TF</th>
            <th className="hidden sm:table-cell w-12 text-center" title="Tantos en contra">TC</th>
            <th className="w-10 sm:w-14 text-center" title="Diferencia de tantos">DIF</th>
          </tr>
        </thead>
        <tbody>
          {tabla.map((fila, i) => (
            <tr key={fila.equipoId} className={huboPartidos && i === 0 ? "bg-primary/10" : ""}>
              <td className="font-bold">{i + 1}</td>
              <td className="min-w-0">
                <div className="font-semibold break-words">{fila.nombre}</div>
                <div className="sm:hidden text-[11px] text-base-content/60">
                  TF {fila.tantosFavor} · TC {fila.tantosContra}
                </div>
              </td>
              <td className="text-center">{fila.pj}</td>
              <td className="text-center font-bold">{fila.pg}</td>
              <td className="text-center">{fila.pp}</td>
              <td className="hidden sm:table-cell text-center">{fila.tantosFavor}</td>
              <td className="hidden sm:table-cell text-center">{fila.tantosContra}</td>
              <td className="text-center">{dif(fila.diferencia)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-base-content/60">
        PJ jugados · PG ganados · PP perdidos · TF/TC tantos a favor/en contra · DIF diferencia.
        Orden: ganados, diferencia y tantos a favor.
      </p>
    </div>
  );
}
