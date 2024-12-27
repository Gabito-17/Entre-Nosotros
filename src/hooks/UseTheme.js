import { useEffect, useState } from "react";

export const useTheme = () => {
  // Recuperar el tema guardado o usar "light" como predeterminado
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Actualizar la clase del body para reflejar el tema
    document.body.setAttribute("data-theme", theme);

    // Guardar el tema en LocalStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Función para cambiar el tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return [theme, toggleTheme];
};
