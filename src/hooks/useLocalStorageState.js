import { useEffect, useState } from "react";

export function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error(`Error leyendo "${key}" desde localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error guardando "${key}" en localStorage:`, error);
    }
  }, [key, state]);

  return [state, setState];
}
