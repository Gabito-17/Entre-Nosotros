"use client";

import { SwatchIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const themes = ["dracula", "business", "lofi", "pastel"];

export default function ThemeSelector() {
  const [theme, setTheme] = useState("dracula");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dracula";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    // 🔐 Cerrar dropdown (quitamos foco)
    document.activeElement && (document.activeElement as HTMLElement).blur();
  };

  return (
    <div className="dropdown dropdown-start">
      <label tabIndex={0} className="btn btn-square btn-ghost">
        <SwatchIcon className="w-6 h-6 text-primary" />
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {themes.map((t) => (
          <li key={t}>
            <button
              data-theme={t}
              className={`w-full btn justify-start gap-2 ${
                theme === t ? "border border-primary" : ""
              }`}
              onClick={() => handleChange(t)}
            >
              <span className="capitalize">{t}</span>
              <div className="flex gap-1 ml-auto">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <div className="w-3 h-3 bg-secondary rounded-full" />
                <div className="w-3 h-3 bg-accent rounded-full" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
