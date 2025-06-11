import { useState } from "react";

const themes = [
  "dracula",
  "black",
  "pastel",
  "forest",
  "lofi",
  "luxury",
  "business",
];

export default function ThemeSelector() {
  const [theme, setTheme] = useState("light");

  const handleChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  return (
    <div className="p-4">
      <select
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
