"use client";

import { useEffect, useState } from "react";
import ConfigurationBar from "./ConfigurationBar.tsx";
import PanelEquipo from "./PanelEquipo.tsx";

type Equipos = "nosotros" | "ellos";

export default function TanteadorTruco() {
  const [puntajes, setPuntajes] = useState<Record<Equipos, number>>({
    nosotros: 0,
    ellos: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("truco-puntajes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.nosotros === "number" &&
          typeof parsed.ellos === "number"
        ) {
          setPuntajes(parsed);
        }
      } catch (e) {
        console.warn("Error parsing localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("truco-puntajes", JSON.stringify(puntajes));
  }, [puntajes]);

  const updateScore = (equipo: Equipos, delta: number) => {
    setPuntajes((prev) => {
      const nuevo = Math.max(0, Math.min(30, prev[equipo] + delta));
      return { ...prev, [equipo]: nuevo };
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-base-200 dark:bg-base-900">
      <ConfigurationBar />

      {/* Paneles lado a lado */}
      <div className="flex flex-row flex-1 divide-x divide-neutral">
        <PanelEquipo
          nombre="NOSOTROS"
          puntaje={puntajes.nosotros}
          onChange={(d) => updateScore("nosotros", d)}
        />
        <PanelEquipo
          nombre="ELLOS"
          puntaje={puntajes.ellos}
          onChange={(d) => updateScore("ellos", d)}
        />
      </div>
    </div>
  );
}
