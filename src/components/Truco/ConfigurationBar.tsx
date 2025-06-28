import { useGameTrucoStore } from "../../stores/useGameTrucoStore.ts";

const ConfigurationBar = () => {
  const { maxScore, pointStyle, toggleMaxScore, setPointStyle } = useGameTrucoStore();

  const resetGame = () => {
    localStorage.removeItem("truco-puntajes");
  };

  // SVG compacto para "lines" en botón (más pequeño que el del score)
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

  return (
    <nav className="relative z-50 w-full bg-base-200 flex items-center h-10 px-2 shadow-sm">
      <div className="flex w-full max-w-screen-xl mx-auto justify-between gap-2">
        {/* Izquierda */}
        <div className="flex-1">
          <div className="dropdown w-full">
            <label
              tabIndex={0}
              className="btn btn-sm btn-outline normal-case w-full h-8 flex justify-center items-center"
            >
              Icono de Puntos
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-1 p-1 shadow bg-base-200 rounded-box w-full max-w-xs"
            >
              <li className="flex justify-around gap-2 p-2">
                {["fosforo", "lines", "poroto"].map((style) => (
                  <button
                    key={style}
                    onClick={() =>
                      setPointStyle(style as "fosforo" | "lines" | "poroto")
                    }
                    className={`rounded border-2 ${
                      pointStyle === style ? "border-primary" : "border-transparent"
                    }`}
                  >
                    {style === "lines" ? (
                      <LinesIcon isActive={pointStyle === "lines"} />
                    ) : (
                      <img
                        src={`/assets/truco/${style}.png`}
                        alt={style}
                        className="w-10 h-10 object-contain"
                      />
                    )}
                  </button>
                ))}
              </li>
            </ul>
          </div>
        </div>

        {/* Centro */}
        <div className="flex-1">
          <button onClick={toggleMaxScore} className="btn btn-sm btn-outline w-full">
            A {maxScore}
          </button>
        </div>

        {/* Derecha */}
        <div className="flex-1">
          <div className="dropdown dropdown-end w-full">
            <label
              tabIndex={0}
              className="btn btn-sm btn-outline btn-error normal-case w-full h-8 flex justify-center items-center"
            >
              Reiniciar
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-1 p-1 shadow bg-base-200 rounded-box w-full max-w-xs"
            >
              <li>
                <button onClick={resetGame} className="text-error w-full text-center">
                  Reiniciar partida
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ConfigurationBar;
