import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useGameTrucoStore } from "../../stores/useGameTrucoStore.ts";

const ConfigurationBar = () => {
  const { maxScore, pointStyle, toggleMaxScore, setPointStyle } =
    useGameTrucoStore();

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
    <nav className="bg-base-200 flex items-center shadow-sm">
      <div className="grid grid-cols-3 w-full">
        {/* Izquierda */}
        <div className="dropdown dropdown-bottom dropdown-center justify-center">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm btn-outline w-full"
          >
            Puntero <PencilSquareIcon className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu w-full bg-base-100 rounded-box z-1 p-2 shadow-sm"
          >
            {["fosforo", "lines", "cafe"].map((style) => (
              <li className="flex justify-around gap-2 p-2">
                <span
                  key={style}
                  onClick={() =>
                      setPointStyle(style as "fosforo" | "lines" | "cafe")
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
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* <div className="flex-1">
          <div className="dropdown w-full">
            <button tabIndex={0} className="btn btn-sm btn-outline btn-primary w-full">
              Icono de Puntos
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-1 p-1 shadow bg-base-200 w-full max-w-[90vw] sm:max-w-xs"
            >
              <li className="flex justify-around gap-2 p-2">
                {["fosforo", "lines", "poroto"].map((style) => (
                  <button
                    key={style}
                    onClick={() =>
                      setPointStyle(style as "fosforo" | "lines" | "poroto")
                    }
                    className={`rounded border-2 ${
                      pointStyle === style
                        ? "border-primary"
                        : "border-transparent"
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
        </div> */}

        {/* Centro */}
        <div className="justify-center">
          <button
            onClick={toggleMaxScore}
            className="btn btn-sm btn-outline  btn-primary w-full"
          >
            A {maxScore}
          </button>
        </div>

        {/* Derecha */}
        <div className="justify-center">
          <div className="btn btn-sm btn-square btn-outline w-full">
            <button onClick={resetGame}>
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ConfigurationBar;
