import { useEffect, useState } from "react";

const themes = ["dracula", "black", "pastel", "lofi", "business"];

export default function ThemeSelector() {
  const [theme, setTheme] = useState("dracula");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dracula";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  return (
    <div>
      <select
        id="tema"
        value={theme}
        onChange={handleChange}
        className="select select-bordered"
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
