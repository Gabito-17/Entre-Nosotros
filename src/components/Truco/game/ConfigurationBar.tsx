"use client";

import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useGameTrucoStore } from "../../../stores/useGameTrucoStore.ts";
import { useUiNotificationStore } from "../../../stores/useUiNotificationStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";

const ConfigurationBar = () => {
  const {
    maxScore,
    pointStyle,
    setMaxScore,
    setPointStyle,
    resetScores,
    score1,
    score2,
    winner,
  } = useGameTrucoStore();

  const addNotification = useUiNotificationStore((s) => s.addNotification);
  const openConfirmationModal = useUiStore((s) => s.openConfirmationModal);

  const LinesIcon = ({ isActive }: { isActive: boolean }) => (
    <svg
      width={35}
      height={45}
      viewBox="0 0 35 45"
      className={isActive ? "text-primary" : "text-gray-500"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {[6, 13, 20, 27].map((x, idx) => (
        <line
          key={idx}
          x1={x}
          y1="8"
          x2={x}
          y2="37"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      <line
        x1="3"
        y1="32"
        x2="30"
        y2="13"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  const handleResetClick = () => {
    openConfirmationModal({
      title: "¿Reiniciar partida?",
      message: "Esto reiniciará los puntajes de ambos equipos. ¿Estás seguro?",
      onConfirm: () => resetScores(),
    });
  };

  // Ya no usamos toggleMaxScore, ahora directamente seteamos un maxScore elegido
  const handleSelectMaxScore = (score: number) => {
    const partidaEnCurso = (score1 > 0 || score2 > 0) && !winner;
    if (partidaEnCurso) {
      addNotification(
        "La partida está en curso. No se puede cambiar el puntaje máximo.",
        "error"
      );
      return;
    }
    setMaxScore(score);
    // Cerrar dropdown
    document.activeElement && (document.activeElement as HTMLElement).blur();
  };

  const handleSelectStyle = (style: "fosforo" | "lines" | "cafe") => {
    setPointStyle(style);
    document.activeElement && (document.activeElement as HTMLElement).blur();
  };

  return (
    <nav className="flex items-center shadow-sm">
      <div className="grid grid-cols-3 w-full">
        {/* Izquierda: Selector de estilo de puntos */}
        <div className="dropdown dropdown-bottom dropdown-center">
          <label
            tabIndex={0}
            className="btn btn-sm btn-outline w-full cursor-pointer flex items-center justify-center gap-1"
          >
            Puntero <PencilSquareIcon className="h-5 w-5" />
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-w-xs"
          >
            {["fosforo", "lines", "cafe"].map((style) => (
              <li key={style} className="flex justify-around gap-2 p-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectStyle(style as "fosforo" | "lines" | "cafe")
                  }
                  className={`rounded border-2 flex gap-1 btn ${
                    pointStyle === style
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  {style === "lines" ? (
                    <LinesIcon isActive={pointStyle === "lines"} />
                  ) : (
                    <img
                      src={`/assets/truco/${style}.svg`}
                      alt={style}
                      className="w-10 h-10 object-contain"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Centro: Selector de puntaje máximo */}
        <div className="dropdown dropdown-bottom dropdown-center">
          <label
            tabIndex={0}
            className="btn btn-sm btn-outline btn-primary w-full cursor-pointer"
          >
            A {maxScore}
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-w-xs"
          >
            {[15, 18, 30].map((score) => (
              <li key={score} className="p-2">
                <button
                  type="button"
                  onClick={() => handleSelectMaxScore(score)}
                  className={`btn w-full ${
                    maxScore === score ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {score}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Derecha: Botón de reinicio */}
        <div className="justify-center">
          <button
            onClick={handleResetClick}
            className="btn btn-sm btn-square btn-outline w-full"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ConfigurationBar;
